import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getProduct } from '@/lib/products'

// In-memory rate limit: email → last request timestamp
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_MS = 60_000 // 1 min between order attempts per email

export async function POST(req: NextRequest) {
  try {
    const { productId, name, email, phone } = await req.json()

    if (!productId || !email || !name) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    const emailLower = (email as string).toLowerCase().trim()

    // Rate limit: 1 order attempt per email per minute
    const lastAttempt = rateLimitMap.get(emailLower) ?? 0
    if (Date.now() - lastAttempt < RATE_LIMIT_MS) {
      return NextResponse.json({ error: 'Пожалуйста, подождите перед повторной попыткой' }, { status: 429 })
    }
    rateLimitMap.set(emailLower, Date.now())

    const product = getProduct(productId)
    if (!product) {
      return NextResponse.json({ error: 'Продукт не найден' }, { status: 404 })
    }

    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id || null
    const sessionTier = (session?.user as any)?.tier as string | undefined

    // Intro credit: verify from DB — JWT token can be stale after tier upgrade
    const INTRO_CREDIT = 1
    const FULL_PROGRAM_PRODUCTS = ['base', 'plus', 'plus-pro', 'personal', 'personal-start', 'personal-balance', 'personal-deep']
    let hasIntroCredit = false

    if (userId && FULL_PROGRAM_PRODUCTS.includes(productId)) {
      try {
        const userOrders = await prisma.order.findMany({
          where: { userId, status: { in: ['paid', 'paid_email_failed'] } },
          select: { product: true },
        })
        const hasPaidIntro        = userOrders.some((o: { product: string }) => o.product === 'intro')
        const hasPaidFullProgram  = userOrders.some((o: { product: string }) => FULL_PROGRAM_PRODUCTS.includes(o.product))
        // Credit only if intro is paid AND no full program yet (prevents double-credit on upgrade)
        hasIntroCredit = hasPaidIntro && !hasPaidFullProgram
      } catch {
        // DB unavailable — fall back to JWT tier (less reliable)
        hasIntroCredit = sessionTier === 'intro'
      }
    }

    const finalAmount = hasIntroCredit ? Math.max(0, product.price - INTRO_CREDIT) : product.price

    // Deduplication: return existing pending order for same email+product (within 10 min)
    const existing = await prisma.order.findFirst({
      where: {
        email: emailLower,
        product: productId,
        status: 'pending',
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
    })
    if (existing?.paymentId) {
      // Re-fetch payment URL from YooKassa if keys available
      const shopId = process.env.YOOKASSA_SHOP_ID
      const secretKey = process.env.YOOKASSA_SECRET_KEY
      if (shopId && secretKey) {
        try {
          const ykRes = await fetch(`https://api.yookassa.ru/v3/payments/${existing.paymentId}`, {
            headers: { Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}` },
          })
          if (ykRes.ok) {
            const ykData = await ykRes.json()
            if (ykData.status === 'pending' && ykData.confirmation?.confirmation_url) {
              return NextResponse.json({ paymentUrl: ykData.confirmation.confirmation_url, orderId: existing.id })
            }
          }
        } catch {}
      }
    }

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        email: emailLower,
        name,
        phone: phone || null,
        product: productId,
        productName: product.name,
        amount: finalAmount,
        status: 'pending',
      },
    })

    // YooKassa integration (when keys are configured)
    const shopId = process.env.YOOKASSA_SHOP_ID
    const secretKey = process.env.YOOKASSA_SECRET_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://restart-program.ru'

    if (shopId && secretKey) {
      const ykRes = await fetch('https://api.yookassa.ru/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
          'Idempotence-Key': order.id,
        },
        body: JSON.stringify({
          amount: { value: (finalAmount / 100).toFixed(2), currency: 'RUB' },
          confirmation: {
            type: 'redirect',
            return_url: `${siteUrl}/checkout/success?order=${order.id}&product=${product.id}&name=${encodeURIComponent(product.name)}&amount=${finalAmount}`,
          },
          capture: true,
          description: `${product.name} — Restart`,
          metadata: { orderId: order.id },
        }),
      })

      if (ykRes.ok) {
        const ykData = await ykRes.json()
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentId: ykData.id },
        })
        return NextResponse.json({ paymentUrl: ykData.confirmation.confirmation_url, orderId: order.id })
      }
    }

    // Fallback: return order ID for manual payment
    return NextResponse.json({
      orderId: order.id,
      message: 'Заказ создан. Мы свяжемся с вами для оформления оплаты.',
    })
  } catch (error) {
    console.error('Payment create error:', error)
    return NextResponse.json({ error: 'Ошибка создания платежа' }, { status: 500 })
  }
}

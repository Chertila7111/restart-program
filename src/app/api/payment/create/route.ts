import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getProduct } from '@/lib/products'

export async function POST(req: NextRequest) {
  try {
    const { productId, name, email, phone } = await req.json()

    if (!productId || !email || !name) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    const product = getProduct(productId)
    if (!product) {
      return NextResponse.json({ error: 'Продукт не найден' }, { status: 404 })
    }

    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id || null

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        email,
        name,
        phone: phone || null,
        product: productId,
        productName: product.name,
        amount: product.price,
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
          amount: { value: (product.price / 100).toFixed(2), currency: 'RUB' },
          confirmation: {
            type: 'redirect',
            return_url: `${siteUrl}/checkout/success?order=${order.id}&product=${product.id}&name=${encodeURIComponent(product.name)}&amount=${product.price}`,
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

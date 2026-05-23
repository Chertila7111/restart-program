const YM_ID = 109291907

declare global {
  interface Window {
    ym: (id: number, action: string, target?: string, params?: Record<string, unknown>) => void
    dataLayer: Record<string, unknown>[]
  }
}

export function ymGoal(target: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return
  window.ym(YM_ID, 'reachGoal', target, params)
}

export function ymEcommercePurchase({
  orderId,
  productId,
  productName,
  price,
}: {
  orderId: string
  productId: string
  productName: string
  price: number
}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  const category = productId === 'intro' ? 'Вводная встреча' : 'Курс'
  window.dataLayer.push({
    ecommerce: {
      currencyCode: 'RUB',
      purchase: {
        actionField: { id: orderId, revenue: price },
        products: [{ id: productId, name: productName, price, quantity: 1, category }],
      },
    },
  })
  ymGoal('purchase', { order_price: price, currency: 'RUB', product: productId, product_name: productName })
}

export function ymEcommerceCheckout({
  productId,
  productName,
  price,
  step,
}: {
  productId: string
  productName: string
  price: number
  step: number
}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    ecommerce: {
      currencyCode: 'RUB',
      checkout: {
        actionField: { step },
        products: [{ id: productId, name: productName, price, quantity: 1, category: 'Программа' }],
      },
    },
  })
}

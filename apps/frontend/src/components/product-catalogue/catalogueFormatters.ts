import type { ProductStatus } from '../../store/products'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const formatPrice = (price: number) => currencyFormatter.format(price)

export const formatStatus = (status: ProductStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1)

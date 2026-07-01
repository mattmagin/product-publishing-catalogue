import type { ProductHistoryEntry, ProductStatus } from '../../store/products'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const formatPrice = (price: number) => currencyFormatter.format(price)

export const formatStatus = (status: ProductStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1)

export const todayStamp = () =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())

export const formatScheduleValue = (dateValue: string, timeValue: string) => {
  if (!dateValue) return ''

  const date = new Date(`${dateValue}T${timeValue || '00:00'}`)
  if (Number.isNaN(date.getTime())) return dateValue

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export const createHistoryEntry = (
  label: string,
  description: string,
): ProductHistoryEntry => ({
  date: todayStamp(),
  label,
  description,
})

import type {
  Product,
  ProductHistoryEntry,
  ProductStatus,
} from '../store/products'
import { apiClient } from './client'

type ProductResponse = {
  id: number
  sku: string
  title: string
  price: string | number
  image_url: string
  published_at: string | null
  scheduled_publish_at: string | null
  status: ProductStatus
}

type PublicationEventResponse = {
  id: number
  event_type: string
  from_state: ProductStatus
  to_state: ProductStatus
  triggered_by: 'user' | 'system'
  user_name: string | null
  occurred_at: string
}

const formatDateTime = (value: string | null) => {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const humanizeEventType = (eventType: string) => eventType.replaceAll('_', ' ')

const eventDescription = (event: PublicationEventResponse) => {
  const actor =
    event.triggered_by === 'system' ? 'System' : (event.user_name ?? 'User')

  return `${actor} changed product from ${event.from_state} to ${event.to_state}.`
}

const mapProduct = (product: ProductResponse): Product => ({
  apiId: product.id,
  id: product.sku,
  title: product.title,
  price: Number(product.price),
  status: product.status,
  scheduledPublish: formatDateTime(product.scheduled_publish_at),
  imageUrl: product.image_url,
  history: [],
  historyLoaded: false,
})

const mapPublicationEvent = (
  event: PublicationEventResponse,
): ProductHistoryEntry => ({
  value: String(event.id),
  title: `${formatDateTime(event.occurred_at) ?? 'Unknown date'} - ${humanizeEventType(event.event_type)}`,
  description: eventDescription(event),
})

export const productCatalogueApi = {
  async listProducts() {
    const products = await apiClient.get('products').json<ProductResponse[]>()

    return products.map(mapProduct)
  },
  async listProductHistory(productApiId: number) {
    const events = await apiClient
      .get('publication_events', {
        searchParams: {
          product_id: productApiId,
        },
      })
      .json<PublicationEventResponse[]>()

    return events.map(mapPublicationEvent)
  },
  async publishNow(productApiId: number) {
    const product = await apiClient
      .post(`products/${productApiId}/publish`)
      .json<ProductResponse>()

    return mapProduct(product)
  },
  async unpublishNow(productApiId: number) {
    const product = await apiClient
      .post(`products/${productApiId}/unpublish`)
      .json<ProductResponse>()

    return mapProduct(product)
  },
  async publishLater(productApiId: number, scheduledAt: string) {
    const product = await apiClient
      .post(`products/${productApiId}/publish_later`, {
        json: {
          scheduled_at: scheduledAt,
        },
      })
      .json<ProductResponse>()

    return mapProduct(product)
  },
  async cancelPublishLater(productApiId: number) {
    const product = await apiClient
      .delete(`products/${productApiId}/publish_later`)
      .json<ProductResponse>()

    return mapProduct(product)
  },
}

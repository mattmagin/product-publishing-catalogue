import { apiClient } from './client'

export type StorefrontProduct = {
  apiId: number
  sku: string
  title: string
  price: number
  imageUrl: string
}

type StorefrontProductResponse = {
  id: number
  sku: string
  title: string
  price: string | number
  image_url: string
}

const mapStorefrontProduct = (
  product: StorefrontProductResponse,
): StorefrontProduct => ({
  apiId: product.id,
  sku: product.sku,
  title: product.title,
  price: Number(product.price),
  imageUrl: product.image_url,
})

export const storefrontApi = {
  async listProducts() {
    const products = await apiClient
      .get('products', {
        searchParams: {
          status: 'published',
        },
      })
      .json<StorefrontProductResponse[]>()

    return products.map(mapStorefrontProduct)
  },
}

import { create } from 'zustand'
import productsFixture from '../data/products.json'

export type Product = (typeof productsFixture)[number]
export type ProductStatus = Product['status']
export type ProductHistoryEntry = Product['history'][number]

type ProductStoreState = {
  products: Product[]
  setProducts: (products: Product[]) => void
  updateProduct: (
    productId: string,
    updater: (product: Product) => Product,
  ) => void
  publishProduct: (productId: string, historyEntry: ProductHistoryEntry) => void
  unpublishProduct: (
    productId: string,
    historyEntry: ProductHistoryEntry,
  ) => void
  scheduleProduct: (
    productId: string,
    scheduledPublish: string,
    historyEntry: ProductHistoryEntry,
  ) => void
  cancelScheduledPublish: (
    productId: string,
    historyEntry: ProductHistoryEntry,
  ) => void
}

const initialProducts = productsFixture as Product[]

const prependHistory = (
  product: Product,
  historyEntry: ProductHistoryEntry,
): Product => ({
  ...product,
  history: [historyEntry, ...product.history],
})

export const useProductsStore = create<ProductStoreState>()((set) => ({
  products: initialProducts,
  setProducts: (products) => set({ products }),
  updateProduct: (productId, updater) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? updater(product) : product,
      ),
    })),
  publishProduct: (productId, historyEntry) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? prependHistory(
              {
                ...product,
                status: 'published',
                scheduledPublish: null,
              },
              historyEntry,
            )
          : product,
      ),
    })),
  unpublishProduct: (productId, historyEntry) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? prependHistory(
              {
                ...product,
                status: 'draft',
                scheduledPublish: null,
              },
              historyEntry,
            )
          : product,
      ),
    })),
  scheduleProduct: (productId, scheduledPublish, historyEntry) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? prependHistory(
              {
                ...product,
                status: 'scheduled',
                scheduledPublish,
              },
              historyEntry,
            )
          : product,
      ),
    })),
  cancelScheduledPublish: (productId, historyEntry) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? prependHistory(
              {
                ...product,
                status: 'draft',
                scheduledPublish: null,
              },
              historyEntry,
            )
          : product,
      ),
    })),
}))

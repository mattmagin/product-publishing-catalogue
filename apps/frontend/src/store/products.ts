import { create } from 'zustand'
import { apiErrorMessage } from '../api/client'
import { productCatalogueApi } from '../api/productCatalogue'

export type ProductStatus = 'draft' | 'scheduled' | 'published'

export type ProductHistoryEntry = {
  value: string
  title: string
  description: string
}

export type Product = {
  apiId: number
  id: string
  title: string
  price: number
  status: ProductStatus
  scheduledPublish: string | null
  imageUrl: string
  history: ProductHistoryEntry[]
  historyLoaded: boolean
}

type ProductStoreState = {
  products: Product[]
  loading: boolean
  error: string | null
  actionLoadingByProductId: Record<string, boolean>
  historyLoadingByProductId: Record<string, boolean>
  historyErrorByProductId: Record<string, string | null>
  loadProducts: () => Promise<void>
  loadProductHistory: (product: Product) => Promise<void>
  publishNow: (product: Product) => Promise<void>
  unpublishNow: (product: Product) => Promise<void>
  publishLater: (product: Product, scheduledAt: string) => Promise<void>
  cancelPublishLater: (product: Product) => Promise<void>
}

export const useProductsStore = create<ProductStoreState>()((set, get) => ({
  products: [],
  loading: false,
  error: null,
  actionLoadingByProductId: {},
  historyLoadingByProductId: {},
  historyErrorByProductId: {},
  loadProducts: async () => {
    set({ loading: true, error: null })

    try {
      const products = await productCatalogueApi.listProducts()
      set({
        products,
        loading: false,
        error: null,
      })
    } catch (error) {
      set({
        products: [],
        loading: false,
        error: await apiErrorMessage(error),
      })
    }
  },
  loadProductHistory: async (product) => {
    const existingProduct = get().products.find(({ id }) => id === product.id)
    if (!existingProduct) return

    set((state) => ({
      historyLoadingByProductId: {
        ...state.historyLoadingByProductId,
        [product.id]: true,
      },
      historyErrorByProductId: {
        ...state.historyErrorByProductId,
        [product.id]: null,
      },
    }))

    try {
      const history = await productCatalogueApi.listProductHistory(
        product.apiId,
      )

      set((state) => ({
        products: state.products.map((currentProduct) =>
          currentProduct.id === product.id
            ? {
                ...currentProduct,
                history,
                historyLoaded: true,
              }
            : currentProduct,
        ),
        historyLoadingByProductId: {
          ...state.historyLoadingByProductId,
          [product.id]: false,
        },
      }))
    } catch (error) {
      const message = await apiErrorMessage(error)

      set((state) => ({
        historyLoadingByProductId: {
          ...state.historyLoadingByProductId,
          [product.id]: false,
        },
        historyErrorByProductId: {
          ...state.historyErrorByProductId,
          [product.id]: message,
        },
      }))
    }
  },
  publishNow: async (product) => {
    await runProductAction(product, () =>
      productCatalogueApi.publishNow(product.apiId),
    )
  },
  unpublishNow: async (product) => {
    await runProductAction(product, () =>
      productCatalogueApi.unpublishNow(product.apiId),
    )
  },
  publishLater: async (product, scheduledAt) => {
    await runProductAction(product, () =>
      productCatalogueApi.publishLater(product.apiId, scheduledAt),
    )
  },
  cancelPublishLater: async (product) => {
    await runProductAction(product, () =>
      productCatalogueApi.cancelPublishLater(product.apiId),
    )
  },
}))

const runProductAction = async (
  product: Product,
  action: () => Promise<Product>,
) => {
  const { setState, getState } = useProductsStore

  setState((state) => ({
    actionLoadingByProductId: {
      ...state.actionLoadingByProductId,
      [product.id]: true,
    },
  }))

  try {
    const updatedProduct = await action()

    setState((state) => ({
      products: state.products.map((currentProduct) =>
        currentProduct.id === product.id
          ? {
              ...updatedProduct,
              history: currentProduct.history,
              historyLoaded: false,
            }
          : currentProduct,
      ),
    }))

    await getState().loadProductHistory(updatedProduct)
  } catch (error) {
    throw new Error(await apiErrorMessage(error), { cause: error })
  } finally {
    setState((state) => ({
      actionLoadingByProductId: {
        ...state.actionLoadingByProductId,
        [product.id]: false,
      },
    }))
  }
}

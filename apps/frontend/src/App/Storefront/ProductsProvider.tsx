// TODO: there is drift between the product and the StorefrontProduct
import type { Product } from '@/store/products'
import { apiErrorMessage } from '@/api/client'
import { storefrontApi, type StorefrontProduct } from '@/api/storefront'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

type ProductsContextValue = {
  products: StorefrontProduct[]
  setProducts: (products: StorefrontProduct[]) => void
  loading: boolean
  error: string | null
}

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined,
)

type StorefrontProviderProps = {
  children: ReactNode
}

// Currently just placed the products provider here as it doesn't need to load when not using the storefront
const ProductsProvider = ({ children }: StorefrontProviderProps) => {
  const [products, setProducts] = useState<StorefrontProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: deprecate active var
    let active = true

    const loadProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        // TODO: the api should catch our error and just return it
        const nextProducts = await storefrontApi.listProducts()
        if (!active) return

        setProducts(nextProducts)
        setLoading(false)
      } catch (error) {
        if (!active) return

        setProducts([])
        setError(await apiErrorMessage(error))
        setLoading(false)
      }
    }

    void loadProducts()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      products,
      setProducts,
      loading,
      error,
    }),
    [products, error, loading],
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)

  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }

  return context
}

export default ProductsProvider

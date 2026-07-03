import { useProducts } from './ProductsProvider'
import Product from './Product'
import { Grid } from '@chakra-ui/react'
import Alert from '@/components/Alert'

const Products = () => {
  const { error, loading, products } = useProducts()
  const hasProducts = products.length > 0

  if (error)
    return <Alert status="error" title="Products could not be loaded." />
  if (loading) return <Alert title="Loading products..." />
  if (!hasProducts)
    return <Alert title="No products are available right now." />

  return (
    <Grid
      autoFlow="row"
      templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
      gap="6"
    >
      {products.map((product) => (
        <Product key={product.sku} product={product} />
      ))}
    </Grid>
  )
}

export default Products

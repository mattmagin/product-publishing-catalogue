import { useProducts } from './ProductsProvider'
import Product from './Product'
import { Grid } from '@chakra-ui/react'
import Alert from '@/components/Alert'

const Products = () => {
  const { error, loading, products } = useProducts()
  const hasProducts = products.length > 0

  if (error) return <Alert status="error">Products could not be loaded.</Alert>
  if (loading) return <Alert>Loading products...</Alert>
  if (!hasProducts) return <Alert>No products are available right now.</Alert>

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

import { type StorefrontProduct } from '@/api/storefront'
import { Card, Image, Text, FormatNumber } from '@chakra-ui/react'

interface ProductProps {
  product: StorefrontProduct
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <Card.Root maxW="sm" overflow="hidden">
      <Image
        src={product.imageUrl}
        alt={product.title}
        aspectRatio={4 / 3}
        fit="cover"
      />
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
        <Text textStyle="md" fontWeight="light" mt="2">
          {/*Using USD here as a quick fix as AUD added a 'A' to the price*/}
          <FormatNumber value={product.price} style="currency" currency="USD" />
        </Text>
      </Card.Body>
    </Card.Root>
  )
}

export default Product

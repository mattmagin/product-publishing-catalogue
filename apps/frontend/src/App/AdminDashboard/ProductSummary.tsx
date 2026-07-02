import type { Product } from '../../store/products'
import { Image, Stack, Text } from '@chakra-ui/react'
import getStatusTag from '@/helpers/getStatusTag'
import Price from '@/components/Price'

type ProductSummaryProps = {
  product: Product
}

export function ProductSummary({ product }: ProductSummaryProps) {
  const StatusTag = getStatusTag(product.status)

  return (
    <Stack>
      <div>{StatusTag}</div>
      <Text textStyle="xl">{product.title}</Text>
      <Text textStyle="xs" fontWeight="light">
        {product.id}
      </Text>
      <Text textStyle="xs" fontWeight="light">
        {'Price: '}
        <Price price={product.price} />
      </Text>
      <Image
        src={product.imageUrl}
        alt={product.title}
        h="200px"
        fit="contain"
      />
    </Stack>
  )
}

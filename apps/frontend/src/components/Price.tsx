import { FormatNumber } from '@chakra-ui/react'

const Price = ({ price }) => {
  return <FormatNumber value={price} style="currency" currency="USD" />
}

export default Price

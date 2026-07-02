import styled from 'styled-components'
import { useProductsStore } from '@/store/products'
import { ProductActions } from './ProductActions'
import { PublishingHistory } from '../PublishingHistory'
import { ProductSummary } from '../ProductSummary'

type ProductDetailsProps = {
  selectedProductId: string | null
}

export function ProductDetails({ selectedProductId }: ProductDetailsProps) {
  const products = useProductsStore((state) => state.products)
  const loading = useProductsStore((state) => state.loading)
  const product =
    products.find((product) => product.id === selectedProductId) ?? null

  if (!product) {
    return (
      <EmptyDetails>
        {loading ? 'Loading product details...' : 'No product selected.'}
      </EmptyDetails>
    )
  }

  return (
    <DetailsPanel aria-labelledby="selected-product-title">
      <DetailsSection>
        <ProductSummary product={product} />
      </DetailsSection>

      <ProductActions key={product.id} product={product} />

      <PublishingHistory productId={product.id} />
    </DetailsPanel>
  )
}

const DetailsPanel = styled.aside`
  overflow: hidden;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  background: #ffffff;
`

const DetailsSection = styled.section`
  padding: 18px 20px;

  & + & {
    border-top: 1px solid #edf0f5;
  }
`

const EmptyDetails = styled.aside`
  border: 1px solid #d9dee8;
  border-radius: 4px;
  padding: 18px 20px;
  background: #ffffff;
  color: #475467;
  font-size: 13px;
`

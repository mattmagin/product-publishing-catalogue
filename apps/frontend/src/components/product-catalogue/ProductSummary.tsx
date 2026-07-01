import styled from 'styled-components'
import type { Product } from '../../store/products'
import { formatPrice } from './catalogueFormatters'
import { ProductStatusBadge } from './ProductStatusBadge'

type ProductSummaryProps = {
  product: Product
}

export function ProductSummary({ product }: ProductSummaryProps) {
  return (
    <Summary>
      <ProductImage src={product.imageUrl} alt="" />
      <div>
        <ProductName id="selected-product-title">{product.title}</ProductName>
        <ProductId>{product.id}</ProductId>
        <DetailLabel>Price</DetailLabel>
        <DetailValue>{formatPrice(product.price)}</DetailValue>
        <DetailLabel>Status</DetailLabel>
        <ProductStatusBadge status={product.status} />
      </div>
    </Summary>
  )
}

const Summary = styled.div`
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 18px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ProductImage = styled.img`
  width: 128px;
  aspect-ratio: 1;
  border: 1px solid #d9dee8;
  border-radius: 3px;
  object-fit: cover;
  background: #f8fafc;
`

const ProductName = styled.h3`
  margin: 0 0 5px;
  color: #111827;
  font-size: 17px;
  line-height: 1.25;
  font-weight: 750;
`

const ProductId = styled.div`
  margin-bottom: 14px;
  color: #475467;
  font-size: 13px;
`

const DetailLabel = styled.div`
  margin-top: 10px;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
`

const DetailValue = styled.div`
  margin-top: 3px;
  color: #111827;
  font-size: 13px;
`

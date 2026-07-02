import styled from 'styled-components'
import type { Product } from '../../store/products'
import { ProductActions } from './ProductActions'
import { PublishingHistory } from './PublishingHistory'
import { ProductSummary } from './ProductSummary'

type ProductDetailsProps = {
  product: Product
  scheduleDate: string
  scheduleTime: string
  historyLoading: boolean
  historyError: string | null
  actionLoading: boolean
  onScheduleDateChange: (date: string) => void
  onScheduleTimeChange: (time: string) => void
  onPublishNow: () => void
  onUnpublishNow: () => void
}

export function ProductDetails({
  product,
  scheduleDate,
  scheduleTime,
  historyLoading,
  historyError,
  actionLoading,
  onScheduleDateChange,
  onScheduleTimeChange,
  onPublishNow,
  onUnpublishNow,
}: ProductDetailsProps) {
  return (
    <DetailsPanel aria-labelledby="selected-product-title">
      <DetailsSection>
        <SectionTitle>Selected Product</SectionTitle>
        <ProductSummary product={product} />
      </DetailsSection>

      <ProductActions
        product={product}
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        onScheduleDateChange={onScheduleDateChange}
        onScheduleTimeChange={onScheduleTimeChange}
        onPublishNow={onPublishNow}
        onUnpublishNow={onUnpublishNow}
        actionLoading={actionLoading}
      />

      <PublishingHistory
        history={product.history}
        loading={historyLoading}
        error={historyError}
      />
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

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: #111827;
  font-size: 14px;
  line-height: 1.3;
  font-weight: 750;
`

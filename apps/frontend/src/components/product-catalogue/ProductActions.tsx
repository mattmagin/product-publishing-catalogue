import styled from 'styled-components'
import type { Product } from '../../store/products'
import { ProductScheduleForm } from './ProductScheduleForm'

type ProductActionsProps = {
  product: Product
  scheduleDate: string
  scheduleTime: string
  onScheduleDateChange: (date: string) => void
  onScheduleTimeChange: (time: string) => void
  onPublishNow: () => void
  onUnpublishNow: () => void
  actionLoading?: boolean
  disabled?: boolean
}

export function ProductActions({
  product,
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
  onPublishNow,
  onUnpublishNow,
  actionLoading = false,
  disabled = false,
}: ProductActionsProps) {
  const canPublishNow = product.status !== 'published'
  const canUnpublishNow = product.status === 'published'

  return (
    <DetailsSection>
      <SectionTitle>Actions</SectionTitle>
      <ActionGrid>
        <PrimaryButton
          type="button"
          disabled={disabled || actionLoading || !canPublishNow}
          onClick={onPublishNow}
        >
          {actionLoading && canPublishNow ? 'Publishing...' : 'Publish now'}
        </PrimaryButton>
        <SecondaryButton
          type="button"
          disabled={disabled || actionLoading || !canUnpublishNow}
          onClick={onUnpublishNow}
        >
          {actionLoading && canUnpublishNow
            ? 'Unpublishing...'
            : 'Unpublish now'}
        </SecondaryButton>
      </ActionGrid>

      <ProductScheduleForm
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        onScheduleDateChange={onScheduleDateChange}
        onScheduleTimeChange={onScheduleTimeChange}
        disabled
      />

      <ScheduleStatus>
        <span>{product.scheduledPublish ?? 'No scheduled publish'}</span>
        <SecondaryButton
          type="button"
          disabled
        >
          Cancel scheduled publish
        </SecondaryButton>
      </ScheduleStatus>
    </DetailsSection>
  )
}

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

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border-radius: 4px;
  padding: 0 14px;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;

  &:disabled {
    opacity: 0.48;
    cursor: default;
  }
`

const PrimaryButton = styled(BaseButton)`
  border: 1px solid #059669;
  background: #059669;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #047857;
  }
`

const SecondaryButton = styled(BaseButton)`
  border: 1px solid #d9dee8;
  background: #ffffff;
  color: #344054;

  &:hover:not(:disabled) {
    background: #f8fafc;
  }
`

const ScheduleStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  color: #475467;
  font-size: 13px;

  ${SecondaryButton} {
    min-height: 30px;
    font-size: 12px;
  }
`

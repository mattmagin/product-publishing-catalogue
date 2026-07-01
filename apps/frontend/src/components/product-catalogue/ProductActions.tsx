import styled from 'styled-components'
import type { Product } from '../../store/products'
import { ProductScheduleForm } from './ProductScheduleForm'

type ProductActionsProps = {
  product: Product
  scheduleDate: string
  scheduleTime: string
  onPublish: () => void
  onUnpublish: () => void
  onScheduleDateChange: (date: string) => void
  onScheduleTimeChange: (time: string) => void
  onSchedule: () => void
  onCancelScheduledPublish: () => void
}

export function ProductActions({
  product,
  scheduleDate,
  scheduleTime,
  onPublish,
  onUnpublish,
  onScheduleDateChange,
  onScheduleTimeChange,
  onSchedule,
  onCancelScheduledPublish,
}: ProductActionsProps) {
  return (
    <DetailsSection>
      <SectionTitle>Actions</SectionTitle>
      <ActionGrid>
        <PrimaryButton type="button" onClick={onPublish}>
          Publish now
        </PrimaryButton>
        <SecondaryButton type="button" onClick={onUnpublish}>
          Unpublish now
        </SecondaryButton>
      </ActionGrid>

      <ProductScheduleForm
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        onScheduleDateChange={onScheduleDateChange}
        onScheduleTimeChange={onScheduleTimeChange}
        onSchedule={onSchedule}
      />

      <ScheduleStatus>
        <span>{product.scheduledPublish ?? 'No scheduled publish'}</span>
        <SecondaryButton
          type="button"
          onClick={onCancelScheduledPublish}
          disabled={!product.scheduledPublish}
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

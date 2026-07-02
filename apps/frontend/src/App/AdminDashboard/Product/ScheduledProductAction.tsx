import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import styled from 'styled-components'
import type { Product } from '../../../store/products'
import { CancelScheduledPublishDialog } from './CancelScheduledPublishDialog'

interface ScheduledProductActionProps {
  product: Product
  isLoading: boolean
}

export const ScheduledProductAction = ({
  product,
  isLoading,
}: ScheduledProductActionProps) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const schedule = {
    label: 'Scheduled publish',
    date: product.scheduledPublish,
    cancelLabel: 'Cancel scheduled publish',
  }

  if (!schedule.date) return null

  return (
    <>
      <ScheduleStatus>
        <ScheduleDetails>
          <ScheduleLabel>{schedule.label}</ScheduleLabel>
          <span>{schedule.date}</span>
        </ScheduleDetails>
        <Button
          type="button"
          size="xs"
          variant="outline"
          disabled={isLoading}
          onClick={() => setIsCancelDialogOpen(true)}
        >
          {isLoading ? 'Cancelling...' : schedule.cancelLabel}
        </Button>
      </ScheduleStatus>

      <CancelScheduledPublishDialog
        product={product}
        isOpen={isCancelDialogOpen}
        isLoading={isLoading}
        onClose={() => setIsCancelDialogOpen(false)}
      />
    </>
  )
}

const ScheduleStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #475467;
  font-size: 13px;
`

const ScheduleDetails = styled.div`
  display: grid;
  gap: 2px;
`

const ScheduleLabel = styled.span`
  color: #111827;
  font-weight: 650;
`

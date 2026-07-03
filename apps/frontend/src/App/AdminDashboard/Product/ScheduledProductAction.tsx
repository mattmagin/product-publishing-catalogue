import { useState } from 'react'
import { Button, Text } from '@chakra-ui/react'
import { LuX } from 'react-icons/lu'
import styled from 'styled-components'
import type { Product } from '../../../store/products'
import { CancelScheduledPublishDialog } from './Dialog/CancelScheduledPublishDialog'
import Alert from '@/components/Alert'

const Container = styled.div`
  padding: 18px 20px;
`

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
    label: 'Scheduled to go live at: ',
    date: product.scheduledPublish,
  }

  if (!schedule.date) return null

  return (
    <Container>
      <Alert
        status="warning"
        title={schedule.label}
        description={
          <ScheduleDetails>
            <Text>{schedule.date}</Text>
          </ScheduleDetails>
        }
        action={
          <ScheduleActionRow>
            <Button
              type="button"
              size="sm"
              variant="outline"
              colorPalette="red"
              disabled={isLoading}
              onClick={() => setIsCancelDialogOpen(true)}
              width="100%"
            >
              <LuX aria-hidden="true" />
              {isLoading ? 'Cancelling...' : 'Cancel scheduled publish'}
            </Button>
          </ScheduleActionRow>
        }
      />

      <CancelScheduledPublishDialog
        product={product}
        isOpen={isCancelDialogOpen}
        isLoading={isLoading}
        onClose={() => setIsCancelDialogOpen(false)}
      />
    </Container>
  )
}

const ScheduleDetails = styled.div`
  display: grid;
  min-width: 0;
  gap: 4px;
  color: #5b6b85;
  font-size: 13px;
`

const ScheduleActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  @media (max-width: 520px) {
    justify-content: stretch;
  }
`

import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import styled from 'styled-components'
import Dialog from '@/components/Dialog'
import { ProductScheduleForm } from '../ProductScheduleForm'
import { scheduleInputToIso } from '../productScheduleDateTime'
import { useProductsStore, type Product } from '../../../store/products'
import { defaultScheduleValues } from './productActionScheduleDefaults'
import { errorMessage, showProductActionToast } from './productActionToast'

interface PublishProductDialogProps {
  product: Product
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
}

type PublishMode = 'now' | 'schedule'

export const PublishProductDialog = ({
  product,
  isOpen,
  isLoading,
  onClose,
}: PublishProductDialogProps) => {
  const publishNow = useProductsStore((state) => state.publishNow)
  const publishLater = useProductsStore((state) => state.publishLater)
  const [publishMode, setPublishMode] = useState<PublishMode>('now')
  const [scheduleDate, setScheduleDate] = useState(
    () => defaultScheduleValues().date,
  )
  const [scheduleTime, setScheduleTime] = useState(
    () => defaultScheduleValues().time,
  )

  const resetDialog = () => {
    const defaults = defaultScheduleValues()
    setScheduleDate(defaults.date)
    setScheduleTime(defaults.time)
    setPublishMode('now')
  }

  const closeDialog = () => {
    onClose()
    resetDialog()
  }

  const handlePublishNow = async () => {
    try {
      await publishNow(product)
      closeDialog()
      showProductActionToast('Product published.', 'success')
    } catch (error) {
      showProductActionToast(
        errorMessage(error, 'Product could not be published.'),
        'error',
      )
    }
  }

  const handleSchedulePublish = async () => {
    try {
      await publishLater(
        product,
        scheduleInputToIso(scheduleDate, scheduleTime),
      )
      closeDialog()
      showProductActionToast('Publish scheduled.', 'success')
    } catch (error) {
      showProductActionToast(
        errorMessage(error, 'Product could not be scheduled.'),
        'error',
      )
    }
  }

  const submitText =
    publishMode === 'schedule'
      ? isLoading
        ? 'Scheduling...'
        : 'Schedule publish'
      : isLoading
        ? 'Publishing...'
        : 'Publish now'

  return (
    <Dialog
      isOpen={isOpen}
      title="Publish product"
      submit={{
        text: submitText,
        callback:
          publishMode === 'schedule' ? handleSchedulePublish : handlePublishNow,
        color: 'green',
        isDisabled:
          isLoading ||
          (publishMode === 'schedule' && (!scheduleDate || !scheduleTime)),
      }}
      cancel={{
        text: 'Cancel',
        callback: closeDialog,
        isDisabled: isLoading,
      }}
    >
      <ModeChoice>
        <Button
          type="button"
          variant={publishMode === 'now' ? 'solid' : 'outline'}
          disabled={isLoading}
          onClick={() => setPublishMode('now')}
        >
          Now
        </Button>
        <Button
          type="button"
          variant={publishMode === 'schedule' ? 'solid' : 'outline'}
          disabled={isLoading}
          onClick={() => setPublishMode('schedule')}
        >
          Schedule
        </Button>
      </ModeChoice>

      {publishMode === 'schedule' ? (
        <ProductScheduleForm
          label="Schedule publish"
          hint="Set a future date and time for this product to go live."
          scheduleDate={scheduleDate}
          scheduleTime={scheduleTime}
          onScheduleDateChange={setScheduleDate}
          onScheduleTimeChange={setScheduleTime}
          disabled={isLoading}
        />
      ) : (
        <DialogCopy>This product will be published immediately.</DialogCopy>
      )}
    </Dialog>
  )
}

const ModeChoice = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const DialogCopy = styled.p`
  margin: 14px 0 0;
  color: #475467;
  font-size: 13px;
  line-height: 1.45;
`

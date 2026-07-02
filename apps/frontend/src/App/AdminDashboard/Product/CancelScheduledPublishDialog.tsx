import Dialog from '@/components/Dialog'
import { useProductsStore, type Product } from '../../../store/products'
import { errorMessage, showProductActionToast } from './productActionToast'

interface CancelScheduledPublishDialogProps {
  product: Product
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
}

export const CancelScheduledPublishDialog = ({
  product,
  isOpen,
  isLoading,
  onClose,
}: CancelScheduledPublishDialogProps) => {
  const cancelPublishLater = useProductsStore(
    (state) => state.cancelPublishLater,
  )

  const handleCancelSchedule = async () => {
    try {
      await cancelPublishLater(product)
      onClose()
      showProductActionToast('Scheduled publish cancelled.', 'success')
    } catch (error) {
      showProductActionToast(
        errorMessage(error, 'Schedule could not be cancelled.'),
        'error',
      )
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      title="Cancel scheduled publish?"
      submit={{
        text: isLoading ? 'Cancelling...' : 'Cancel scheduled publish',
        callback: handleCancelSchedule,
        color: 'red',
        isDisabled: isLoading,
      }}
      cancel={{
        text: 'Keep schedule',
        callback: onClose,
        isDisabled: isLoading,
      }}
    >
      This product will not be published on its scheduled date.
    </Dialog>
  )
}

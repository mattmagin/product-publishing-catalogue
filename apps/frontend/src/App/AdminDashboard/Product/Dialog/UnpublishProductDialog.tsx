import styled from 'styled-components'
import Dialog from '@/components/Dialog'
import { useProductsStore, type Product } from '@/store/products'
import { errorMessage, showProductActionToast } from '../productActionToast'

interface UnpublishProductDialogProps {
  product: Product
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
}

export const UnpublishProductDialog = ({
  product,
  isOpen,
  isLoading,
  onClose,
}: UnpublishProductDialogProps) => {
  const unpublishNow = useProductsStore((state) => state.unpublishNow)

  const closeDialog = () => {
    onClose()
  }

  const handleUnpublishNow = async () => {
    try {
      await unpublishNow(product)
      closeDialog()
      showProductActionToast('Product unpublished.', 'success')
    } catch (error) {
      showProductActionToast(
        errorMessage(error, 'Product could not be unpublished.'),
        'error',
      )
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      title="Unpublish product"
      submit={{
        text: isLoading ? 'Unpublishing...' : 'Unpublish now',
        callback: handleUnpublishNow,
        color: 'red',
        isDisabled: isLoading,
      }}
      cancel={{
        text: 'Cancel',
        callback: closeDialog,
        isDisabled: isLoading,
      }}
    >
      <DialogCopy>This product will be unpublished immediately.</DialogCopy>
    </Dialog>
  )
}

const DialogCopy = styled.p`
  margin: 0;
  color: #475467;
  font-size: 13px;
  line-height: 1.45;
`

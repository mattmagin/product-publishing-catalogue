import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useProductsStore, type Product } from '../../../store/products'
import { ProductActionLayout } from './ProductActionLayout'
import { PublishProductDialog } from './PublishProductDialog'
import { ScheduledProductAction } from './ScheduledProductAction'
import { UnpublishProductDialog } from './UnpublishProductDialog'

interface ProductActionsProps {
  product: Product
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false)
  const actionLoading =
    useProductsStore((state) => state.actionLoadingByProductId[product.id]) ??
    false
  const hasSchedule = Boolean(product.scheduledPublish)

  if (hasSchedule) {
    return (
      <ProductActionLayout>
        <ScheduledProductAction product={product} isLoading={actionLoading} />
      </ProductActionLayout>
    )
  }

  if (product.status === 'published') {
    return (
      <ProductActionLayout>
        <Button
          type="button"
          variant="outline"
          colorPalette="red"
          disabled={actionLoading}
          onClick={() => setIsUnpublishDialogOpen(true)}
          width="100%"
        >
          {actionLoading ? 'Unpublishing...' : 'Unpublish'}
        </Button>
        <UnpublishProductDialog
          product={product}
          isOpen={isUnpublishDialogOpen}
          isLoading={actionLoading}
          onClose={() => setIsUnpublishDialogOpen(false)}
        />
      </ProductActionLayout>
    )
  }

  return (
    <ProductActionLayout>
      <Button
        type="button"
        colorPalette="green"
        disabled={actionLoading}
        onClick={() => setIsPublishDialogOpen(true)}
        width="100%"
      >
        {actionLoading ? 'Publishing...' : 'Publish'}
      </Button>
      <PublishProductDialog
        product={product}
        isOpen={isPublishDialogOpen}
        isLoading={actionLoading}
        onClose={() => setIsPublishDialogOpen(false)}
      />
    </ProductActionLayout>
  )
}

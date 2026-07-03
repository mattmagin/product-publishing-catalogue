import { useState } from 'react'
import { Button, Flex, HStack } from '@chakra-ui/react'
import { useProductsStore, type Product } from '../../../store/products'
import { PublishProductDialog } from './Dialog/PublishProductDialog'
import { ScheduledProductAction } from './ScheduledProductAction'
import { UnpublishProductDialog } from './Dialog/UnpublishProductDialog'

interface ProductActionsProps {
  product: Product
}

// TODO: There is too much duplication in this file
export const ProductActions = ({ product }: ProductActionsProps) => {
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false)
  const actionLoading =
    useProductsStore((state) => state.actionLoadingByProductId[product.id]) ??
    false
  const hasSchedule = Boolean(product.scheduledPublish)

  if (hasSchedule) {
    return (
      <ScheduledProductAction product={product} isLoading={actionLoading} />
    )
  }

  if (product.status === 'published') {
    return (
      <HStack align="center" px="10%">
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
      </HStack>
    )
  }

  return (
    <HStack align="center" px="10%">
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
    </HStack>
  )
}

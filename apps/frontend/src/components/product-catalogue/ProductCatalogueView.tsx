import { Splitter } from '@ark-ui/react/splitter'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useProductsStore, type Product } from '../../store/products'
import { createHistoryEntry, formatScheduleValue } from './catalogueFormatters'
import { ProductDetails } from './ProductDetails'
import { ProductFilters, type StatusFilter } from './ProductFilters'
import { ProductListTable } from './ProductListTable'

export function ProductCatalogueView() {
  const products = useProductsStore((state) => state.products)
  const publishProduct = useProductsStore((state) => state.publishProduct)
  const unpublishProduct = useProductsStore((state) => state.unpublishProduct)
  const scheduleProduct = useProductsStore((state) => state.scheduleProduct)
  const cancelProductScheduledPublish = useProductsStore(
    (state) => state.cancelScheduledPublish,
  )
  const [selectedProductId, setSelectedProductId] = useState(
    () => products[0]?.id ?? '',
  )
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [scheduleDate, setScheduleDate] = useState('2025-05-23')
  const [scheduleTime, setScheduleTime] = useState('09:00')

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesQuery =
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.id.toLowerCase().includes(normalizedQuery)
      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [products, query, statusFilter])

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ??
    filteredProducts[0] ??
    products[0]!

  const publishSelectedProduct = () => {
    if (!selectedProduct) return

    publishProduct(
      selectedProduct.id,
      createHistoryEntry('published', 'Product published immediately.'),
    )
  }

  const unpublishSelectedProduct = () => {
    if (!selectedProduct) return

    unpublishProduct(
      selectedProduct.id,
      createHistoryEntry('unpublished', 'Product returned to draft state.'),
    )
  }

  const scheduleSelectedProduct = () => {
    const formattedSchedule = formatScheduleValue(scheduleDate, scheduleTime)
    if (!formattedSchedule || !selectedProduct) return

    scheduleProduct(
      selectedProduct.id,
      formattedSchedule,
      createHistoryEntry(
        'publish scheduled',
        `Publish scheduled for ${formattedSchedule}.`,
      ),
    )
  }

  const cancelScheduledProductPublish = () => {
    if (!selectedProduct) return

    cancelProductScheduledPublish(
      selectedProduct.id,
      createHistoryEntry(
        'schedule cancelled',
        'Scheduled publish was cancelled.',
      ),
    )
  }

  return (
    <Shell>
      <Content
        defaultSize={[68, 32]}
        panels={[
          { id: 'catalogue', minSize: 48 },
          { id: 'details', minSize: 28 },
        ]}
      >
        <CataloguePanel id="catalogue">
          <ProductFilters
            query={query}
            statusFilter={statusFilter}
            onQueryChange={setQuery}
            onStatusFilterChange={setStatusFilter}
          />
          <ProductListTable
            products={filteredProducts}
            selectedProductId={selectedProduct.id}
            onProductSelect={(product: Product) =>
              setSelectedProductId(product.id)
            }
          />
        </CataloguePanel>

        <ResizeTrigger
          id="catalogue:details"
          aria-label="Resize product panels"
        >
          <Splitter.ResizeTriggerIndicator />
        </ResizeTrigger>

        <DetailsPanel id="details">
          <ProductDetails
            product={selectedProduct}
            scheduleDate={scheduleDate}
            scheduleTime={scheduleTime}
            onPublish={publishSelectedProduct}
            onUnpublish={unpublishSelectedProduct}
            onScheduleDateChange={setScheduleDate}
            onScheduleTimeChange={setScheduleTime}
            onSchedule={scheduleSelectedProduct}
            onCancelScheduledPublish={cancelScheduledProductPublish}
          />
        </DetailsPanel>
      </Content>
    </Shell>
  )
}

const Shell = styled.main`
  min-height: 100svh;
  box-sizing: border-box;
  padding: 18px;
  background: #f8fafc;
  color: #111827;
`

const Content = styled(Splitter.Root)`
  --splitter-border-color: #d9dee8;
  --splitter-handle-color: #98a2b3;
  --splitter-handle-active-color: #2684ff;
  --splitter-handle-size: 28px;

  display: flex;
  align-items: stretch;
  max-width: 1440px;
  min-height: 0;
  margin: 0 auto;

  @media (max-width: 1100px) {
    display: grid;
    gap: 16px;
  }
`

const CataloguePanel = styled(Splitter.Panel)`
  min-width: 0;
`

const DetailsPanel = styled(Splitter.Panel)`
  min-width: 0;
`

const ResizeTrigger = styled(Splitter.ResizeTrigger)`
  position: relative;
  display: grid;
  flex: 0 0 16px;
  place-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: col-resize;
  outline: none;

  &::before {
    content: '';
    position: absolute;
    inset-block: 0;
    width: 1px;
    background: var(--splitter-border-color);
  }

  [data-part='resize-trigger-indicator'] {
    position: relative;
    width: 4px;
    height: var(--splitter-handle-size);
    border-radius: 999px;
    background: var(--splitter-handle-color);
    z-index: 1;
  }

  &:hover,
  &:focus-visible,
  &[data-dragging] {
    --splitter-border-color: rgba(38, 132, 255, 0.42);
    --splitter-handle-color: var(--splitter-handle-active-color);
  }

  &:focus-visible [data-part='resize-trigger-indicator'] {
    outline: 2px solid rgba(38, 132, 255, 0.28);
    outline-offset: 3px;
  }

  @media (max-width: 1100px) {
    display: none;
  }
`

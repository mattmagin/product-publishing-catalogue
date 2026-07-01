import { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  useProductsStore,
  type Product,
} from '../../store/products'
import {
  createHistoryEntry,
  formatScheduleValue,
} from './catalogueFormatters'
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
      <Content>
        <div>
          <ProductFilters
            query={query}
            statusFilter={statusFilter}
            onQueryChange={setQuery}
            onStatusFilterChange={setStatusFilter}
          />
          <ProductListTable
            products={filteredProducts}
            selectedProductId={selectedProduct.id}
            onProductSelect={(product: Product) => setSelectedProductId(product.id)}
          />
        </div>

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

const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: 16px;
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

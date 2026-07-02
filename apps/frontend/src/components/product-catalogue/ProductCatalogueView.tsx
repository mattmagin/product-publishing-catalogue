import { Splitter } from '@ark-ui/react/splitter'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useProductsStore, type Product } from '../../store/products'
import { ProductDetails } from './ProductDetails'
import { ProductFilters, type StatusFilter } from './ProductFilters'
import { ProductListTable } from './ProductListTable'

export function ProductCatalogueView() {
  const products = useProductsStore((state) => state.products)
  const loading = useProductsStore((state) => state.loading)
  const error = useProductsStore((state) => state.error)
  const loadProducts = useProductsStore((state) => state.loadProducts)
  const loadProductHistory = useProductsStore(
    (state) => state.loadProductHistory,
  )
  const publishNow = useProductsStore((state) => state.publishNow)
  const unpublishNow = useProductsStore((state) => state.unpublishNow)
  const actionLoadingByProductId = useProductsStore(
    (state) => state.actionLoadingByProductId,
  )
  const historyLoadingByProductId = useProductsStore(
    (state) => state.historyLoadingByProductId,
  )
  const historyErrorByProductId = useProductsStore(
    (state) => state.historyErrorByProductId,
  )
  const [selectedProductId, setSelectedProductId] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [scheduleDate, setScheduleDate] = useState('2025-05-23')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [toast, setToast] = useState<{
    message: string
    tone: 'success' | 'error'
  } | null>(null)

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

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
    filteredProducts.find((product) => product.id === selectedProductId) ??
    filteredProducts[0] ??
    products[0] ??
    null

  useEffect(() => {
    if (!selectedProduct || selectedProduct.historyLoaded) return

    void loadProductHistory(selectedProduct)
  }, [loadProductHistory, selectedProduct])

  useEffect(() => {
    if (!toast) return

    const timeout = window.setTimeout(() => setToast(null), 3200)

    return () => window.clearTimeout(timeout)
  }, [toast])

  const handlePublishNow = async () => {
    if (!selectedProduct) return

    try {
      await publishNow(selectedProduct)
      setToast({ message: 'Product published.', tone: 'success' })
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Product could not be published.',
        tone: 'error',
      })
    }
  }

  const handleUnpublishNow = async () => {
    if (!selectedProduct) return

    try {
      await unpublishNow(selectedProduct)
      setToast({ message: 'Product unpublished.', tone: 'success' })
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : 'Product could not be unpublished.',
        tone: 'error',
      })
    }
  }

  return (
    <Shell>
      {error ? (
        <ErrorBanner role="alert">
          Products could not be loaded from the API. {error}
        </ErrorBanner>
      ) : null}
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
            selectedProductId={selectedProduct?.id ?? null}
            loading={loading}
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
          {selectedProduct ? (
            <ProductDetails
              product={selectedProduct}
              scheduleDate={scheduleDate}
              scheduleTime={scheduleTime}
              historyLoading={
                historyLoadingByProductId[selectedProduct.id] ?? false
              }
              historyError={historyErrorByProductId[selectedProduct.id] ?? null}
              actionLoading={
                actionLoadingByProductId[selectedProduct.id] ?? false
              }
              onScheduleDateChange={setScheduleDate}
              onScheduleTimeChange={setScheduleTime}
              onPublishNow={handlePublishNow}
              onUnpublishNow={handleUnpublishNow}
            />
          ) : (
            <EmptyDetails>
              {loading ? 'Loading product details...' : 'No product selected.'}
            </EmptyDetails>
          )}
        </DetailsPanel>
      </Content>
      {toast ? (
        <Toast role={toast.tone === 'error' ? 'alert' : 'status'} $tone={toast.tone}>
          {toast.message}
        </Toast>
      ) : null}
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

const ErrorBanner = styled.div`
  max-width: 1440px;
  margin: 0 auto 12px;
  border: 1px solid #fecaca;
  border-radius: 4px;
  padding: 10px 12px;
  background: #fef2f2;
  color: #991b1b;
  font-size: 13px;
`

const CataloguePanel = styled(Splitter.Panel)`
  min-width: 0;
`

const DetailsPanel = styled(Splitter.Panel)`
  min-width: 0;
`

const EmptyDetails = styled.aside`
  border: 1px solid #d9dee8;
  border-radius: 4px;
  padding: 18px 20px;
  background: #ffffff;
  color: #475467;
  font-size: 13px;
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

const Toast = styled.div<{ $tone: 'success' | 'error' }>`
  position: fixed;
  right: 18px;
  bottom: 18px;
  max-width: min(360px, calc(100vw - 36px));
  border: 1px solid
    ${({ $tone }) => ($tone === 'success' ? '#86efac' : '#fecaca')};
  border-radius: 4px;
  padding: 10px 12px;
  background: ${({ $tone }) => ($tone === 'success' ? '#f0fdf4' : '#fef2f2')};
  color: ${({ $tone }) => ($tone === 'success' ? '#166534' : '#991b1b')};
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
  font-size: 13px;
  line-height: 1.4;
`

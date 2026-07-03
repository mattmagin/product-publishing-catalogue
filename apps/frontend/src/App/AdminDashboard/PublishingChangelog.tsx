import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import Dashboard from '@/components/Dashboard'
import SectionHeading from '@/components/SectionHeading'
import Tag from '@/components/Tag'
import {
  useProductsStore,
  type Product,
  type ProductStatus,
} from '../../store/products'
import type { PublicationEvent } from '../../api/productCatalogue'
import { ADMIN_NAV_ITEMS } from './adminNavItems'

type ChangelogRow = PublicationEvent & {
  product: Product | null
  actor: string
}

export function PublishingChangelog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const productFilter = searchParams.get('product')
  const products = useProductsStore((state) => state.products)
  const productsLoading = useProductsStore((state) => state.loading)
  const productsError = useProductsStore((state) => state.error)
  const publicationEvents = useProductsStore((state) => state.publicationEvents)
  const publicationEventsLoading = useProductsStore(
    (state) => state.publicationEventsLoading,
  )
  const publicationEventsError = useProductsStore(
    (state) => state.publicationEventsError,
  )
  const loadProducts = useProductsStore((state) => state.loadProducts)
  const loadPublicationEvents = useProductsStore(
    (state) => state.loadPublicationEvents,
  )

  useEffect(() => {
    void loadProducts()
    void loadPublicationEvents()
  }, [loadProducts, loadPublicationEvents])

  const filteredProduct = useMemo(
    () =>
      productFilter
        ? (products.find((product) => product.id === productFilter) ?? null)
        : null,
    [productFilter, products],
  )

  const rows = useMemo<ChangelogRow[]>(() => {
    const productsByApiId = new Map(
      products.map((product) => [product.apiId, product]),
    )

    return publicationEvents
      .filter((event) =>
        productFilter
          ? filteredProduct != null &&
            event.productApiId === filteredProduct.apiId
          : true,
      )
      .map((event) => ({
        ...event,
        product: productsByApiId.get(event.productApiId) ?? null,
        actor:
          event.triggeredBy === 'system'
            ? 'System'
            : (event.userName ?? 'User'),
      }))
  }, [filteredProduct, productFilter, products, publicationEvents])

  const columns = useMemo<DataTableColumn<ChangelogRow>[]>(
    () => [
      {
        id: 'product',
        name: 'Product',
        selector: (row) => row.product?.title ?? `Product #${row.productApiId}`,
        sortable: true,
        cell: (row) => (
          <ProductCell>
            <ProductTitle>
              {row.product?.title ?? `Product #${row.productApiId}`}
            </ProductTitle>
            {row.product ? <ProductSku>{row.product.id}</ProductSku> : null}
          </ProductCell>
        ),
        width: '20%',
      },
      {
        id: 'occurredAt',
        name: 'Occurred at',
        selector: (row) => new Date(row.occurredAt).getTime(),
        sortable: true,
        cell: (row) => <DateTimeCell value={row.occurredAtLabel} />,
        width: '15%',
      },
      {
        id: 'scheduledAt',
        name: 'Scheduled for',
        selector: (row) => row.scheduledAt ?? '',
        sortable: true,
        cell: (row) => <DateTimeCell value={row.scheduledAtLabel} />,
        width: '15%',
      },
      {
        id: 'eventType',
        name: 'Event',
        selector: (row) => row.eventType,
        sortable: true,
        width: '12%',
      },
      {
        id: 'fromState',
        name: 'From',
        selector: (row) => row.fromState,
        sortable: true,
        cell: (row) => <StatusTag status={row.fromState} />,
        width: '9%',
      },
      {
        id: 'toState',
        name: 'To',
        selector: (row) => row.toState,
        sortable: true,
        cell: (row) => <StatusTag status={row.toState} />,
        width: '9%',
      },
      {
        id: 'actor',
        name: 'Actor',
        selector: (row) => row.actor,
        sortable: true,
        width: '10%',
      },
      {
        id: 'triggeredBy',
        name: 'Trigger source',
        selector: (row) => row.triggeredBy,
        sortable: true,
        cell: (row) => humanizeTrigger(row.triggeredBy),
        width: '10%',
      },
    ],
    [],
  )

  return (
    <Dashboard title="Publishing Changelog" navItems={ADMIN_NAV_ITEMS}>
      <ChangelogPanel aria-labelledby="publishing-changelog-title">
        <PanelHeader>
          <SectionHeading id="publishing-changelog-title">
            Publishing Changelog
          </SectionHeading>
        </PanelHeader>
        {publicationEventsError ? (
          <ErrorState role="alert">
            Publishing changelog could not be loaded. {publicationEventsError}
          </ErrorState>
        ) : (
          <>
            {productFilter ? (
              <FilterBanner role="status">
                <span>
                  Filtered to{' '}
                  <strong>
                    {filteredProduct
                      ? `${filteredProduct.title} / ${filteredProduct.id}`
                      : productFilter}
                  </strong>
                </span>
                <ClearFilterLink to="/admin/publishing-changelog">
                  Clear filter
                </ClearFilterLink>
              </FilterBanner>
            ) : null}
            {productsError ? (
              <WarningState role="status">
                Product details could not be loaded. Showing product ids only.
              </WarningState>
            ) : null}
            <DataTable
              columns={columns}
              data={rows}
              keyField="id"
              loading={publicationEventsLoading || productsLoading}
              onRowClick={(row) => {
                if (!row.product) return

                setSearchParams({ product: row.product.id })
              }}
              pagination
              defaultPageSize={10}
              pageSizeOptions={[10, 15, 20, 25]}
              defaultSort={{ columnId: 'occurredAt', direction: 'desc' }}
              emptyMessage="No publishing events have been recorded."
            />
          </>
        )}
      </ChangelogPanel>
    </Dashboard>
  )
}

const humanizeTrigger = (triggeredBy: PublicationEvent['triggeredBy']) =>
  triggeredBy === 'system' ? 'System' : 'User'

function StatusTag({ status }: { status: ProductStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  const colorPalette =
    status === 'published'
      ? 'green'
      : status === 'scheduled'
        ? 'yellow'
        : 'gray'

  return <Tag colorPalette={colorPalette}>{label}</Tag>
}

function DateTimeCell({ value }: { value: string | null }) {
  if (!value) return '-'
  const [, date, time] = value.replace(',', '').match(/^(.+?),\s*(.+)$/)

  return (
    <DateTimeText>
      <DateLine>{date}</DateLine>
      {time ? <span>{time}</span> : ''}
    </DateTimeText>
  )
}

const ChangelogPanel = styled.section`
  min-width: 0;
`

const PanelHeader = styled.div`
  margin-bottom: 14px;
`

const ProductCell = styled.span`
  display: inline-flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
`

const ProductTitle = styled.span`
  color: #111827;
  font-weight: 700;
`

const ProductSku = styled.span`
  color: #667085;
  font-size: 12px;
`

const DateTimeText = styled.span`
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.25;
`

const DateLine = styled.span`
  white-space: nowrap;
`

const ErrorState = styled.p`
  margin: 0;
  border: 1px solid #fecaca;
  border-radius: 4px;
  background: #fef2f2;
  color: #991b1b;
  padding: 16px;
  font-size: 13px;
`

const FilterBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  background: #eff6ff;
  color: #1e3a8a;
  padding: 12px 14px;
  font-size: 13px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const ClearFilterLink = styled(Link)`
  flex: 0 0 auto;
  color: #0b5cab;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid rgba(38, 132, 255, 0.35);
    outline-offset: 3px;
  }
`

const WarningState = styled.p`
  margin: 0 0 12px;
  border: 1px solid #fed7aa;
  border-radius: 4px;
  background: #fff7ed;
  color: #9a3412;
  padding: 12px 14px;
  font-size: 13px;
`

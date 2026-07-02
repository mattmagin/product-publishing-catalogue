import { useMemo } from 'react'
import styled from 'styled-components'
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable'
import type { Product } from '../../store/products'
import { formatPrice } from './catalogueFormatters'
import { ProductStatusBadge } from './ProductStatusBadge'

type ProductListTableProps = {
  products: Product[]
  selectedProductId: string | null
  loading?: boolean
  onProductSelect: (product: Product) => void
}

export function ProductListTable({
  products,
  selectedProductId,
  loading = false,
  onProductSelect,
}: ProductListTableProps) {
  const productColumns = useMemo<DataTableColumn<Product>[]>(
    () => [
      {
        id: 'title',
        name: 'Product',
        selector: (product) => product.title,
        sortable: true,
        cell: (product) => <ProductNameCell>{product.title}</ProductNameCell>,
        width: '34%',
      },
      {
        id: 'id',
        name: 'Product ID',
        selector: (product) => product.id,
        sortable: true,
        width: '15%',
      },
      {
        id: 'price',
        name: 'Price',
        selector: (product) => product.price,
        sortable: true,
        cell: (product) => formatPrice(product.price),
        width: '13%',
      },
      {
        id: 'status',
        name: 'Status',
        selector: (product) => product.status,
        sortable: true,
        cell: (product) => <ProductStatusBadge status={product.status} />,
        width: '15%',
      },
      {
        id: 'scheduledPublish',
        name: 'Scheduled Publish',
        selector: (product) => product.scheduledPublish ?? '',
        sortable: true,
        cell: (product) => product.scheduledPublish ?? '-',
        width: '20%',
      },
      {
        id: 'open',
        name: <span aria-label="Open product" />,
        cell: () => <RowArrow aria-hidden="true">&gt;</RowArrow>,
        align: 'right',
        width: '3%',
      },
    ],
    [],
  )

  return (
    <CataloguePanel aria-labelledby="catalogue-title">
      <DataTable
        columns={productColumns}
        data={products}
        keyField="id"
        loading={loading}
        selectedRowId={selectedProductId}
        onRowClick={onProductSelect}
        pagination
        defaultPageSize={10}
        pageSizeOptions={[10, 15, 20, 25]}
        defaultSort={{ columnId: 'title', direction: 'asc' }}
        emptyMessage="No products match your filters."
      />
    </CataloguePanel>
  )
}

const CataloguePanel = styled.section`
  min-width: 0;
`

const ProductNameCell = styled.span`
  color: #111827;
  font-weight: 700;
`

const RowArrow = styled.span`
  color: #667085;
  font-size: 18px;
`

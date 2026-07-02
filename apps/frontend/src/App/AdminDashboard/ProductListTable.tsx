import { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import { useProductsStore, type Product } from '../../store/products'
import getStatusTag from '@/helpers/getStatusTag'
import Price from '@/components/Price'

type ProductListTableProps = {
  selectedProductId: string | null
  onProductSelect: (productId: string) => void
}

export function ProductListTable({
  selectedProductId,
  onProductSelect,
}: ProductListTableProps) {
  const products = useProductsStore((state) => state.products)
  const loading = useProductsStore((state) => state.loading)
  const loadProducts = useProductsStore((state) => state.loadProducts)

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

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
        cell: (product) => <Price price={product.price} />,
        width: '13%',
      },
      {
        id: 'status',
        name: 'Status',
        selector: (product) => product.status,
        sortable: true,
        cell: (product) => getStatusTag(product.status),
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
        onRowClick={(product) => onProductSelect(product.id)}
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

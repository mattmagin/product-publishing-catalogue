import type { MouseEvent, ReactNode } from 'react'

export type DataTableSortDirection = 'asc' | 'desc'

export type DataTableSort = {
  columnId: string
  direction: DataTableSortDirection
}

export type DataTableAlign = 'left' | 'center' | 'right'

export type DataTablePrimitive = string | number | boolean | null | undefined

export type DataTableColumn<T> = {
  id: string
  name: ReactNode
  selector?: (row: T, rowIndex: number) => DataTablePrimitive
  cell?: (row: T, rowIndex: number) => ReactNode
  sortable?: boolean
  sortFunction?: (a: T, b: T) => number
  width?: string
  align?: DataTableAlign
}

export type DataTableProps<T extends object> = {
  columns: DataTableColumn<T>[]
  data: T[]
  keyField?: keyof T & string
  className?: string
  loading?: boolean
  emptyMessage?: ReactNode
  selectedRowId?: string | number | null
  highlightOnHover?: boolean
  onRowClick?: (row: T, event: MouseEvent<HTMLTableRowElement>) => void
  defaultSort?: DataTableSort
  sort?: DataTableSort | null
  onSortChange?: (sort: DataTableSort) => void
  manualSorting?: boolean
  pagination?: boolean
  defaultPage?: number
  page?: number
  onPageChange?: (page: number) => void
  defaultPageSize?: number
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  totalRows?: number
  manualPagination?: boolean
}

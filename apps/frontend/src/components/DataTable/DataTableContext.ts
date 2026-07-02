import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { DataTableColumn, DataTableProps, DataTableSort } from './types'

export type DataTableContextValue<T extends object> = {
  activePage: number
  activePageSize: number
  activeSort: DataTableSort | null
  columns: DataTableColumn<T>[]
  data: T[]
  emptyMessage: ReactNode
  firstResult: number
  handlePageChange: (nextPage: number) => void
  handlePageSizeChange: (nextPageSize: number) => void
  handleSort: (column: DataTableColumn<T>) => void
  highlightOnHover: boolean
  lastResult: number
  loading: boolean
  manualPagination: boolean
  onRowClick: DataTableProps<T>['onRowClick']
  pagination: boolean
  rowCount: number
  rowKey: keyof T & string
  selectedRowId: string | number | null
  visibleRows: T[]
}

export const DataTableContext =
  createContext<DataTableContextValue<object> | null>(null)

export function useDataTableContext<T extends object>() {
  const context = useContext(DataTableContext)

  if (!context) {
    throw new Error('useDataTableContext must be used within DataTableProvider')
  }

  return context as unknown as DataTableContextValue<T>
}

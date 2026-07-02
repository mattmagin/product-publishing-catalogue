import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { DataTableContext, type DataTableContextValue } from './DataTableContext'
import { comparePrimitive } from './helpers'
import type { DataTableColumn, DataTableProps, DataTableSort } from './types'

type DataTableProviderProps<T extends object> = DataTableProps<T> & {
  children: ReactNode
}

export function DataTableProvider<T extends object>({
  children,
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = 'There are no records to display',
  selectedRowId = null,
  highlightOnHover = true,
  onRowClick,
  defaultSort,
  sort,
  onSortChange,
  manualSorting = false,
  pagination = false,
  defaultPage = 1,
  page,
  onPageChange,
  defaultPageSize = 10,
  pageSize,
  onPageSizeChange,
  totalRows,
  manualPagination = false,
}: DataTableProviderProps<T>) {
  const [internalSort, setInternalSort] = useState<DataTableSort | null>(
    defaultSort ?? null,
  )
  const [internalPage, setInternalPage] = useState(defaultPage)
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize)

  const activeSort = sort === undefined ? internalSort : sort
  const activePageSize = pageSize ?? internalPageSize
  const rowCount = totalRows ?? data.length
  const pageCount = Math.max(1, Math.ceil(rowCount / activePageSize))
  const activePage = Math.min(page ?? internalPage, pageCount)
  const rowKey = keyField ?? ('id' as keyof T & string)

  const sortedData = useMemo(() => {
    if (manualSorting || !activeSort) return data

    const column = columns.find(({ id }) => id === activeSort.columnId)
    if (!column) return data
    const rowIndexes = new Map(data.map((row, index) => [row, index]))

    return [...data].sort((a, b) => {
      const result = column.sortFunction
        ? column.sortFunction(a, b)
        : comparePrimitive(
            column.selector?.(a, rowIndexes.get(a) ?? 0),
            column.selector?.(b, rowIndexes.get(b) ?? 0),
          )

      return activeSort.direction === 'asc' ? result : result * -1
    })
  }, [activeSort, columns, data, manualSorting])

  const visibleRows = useMemo(() => {
    if (!pagination || manualPagination) return sortedData

    const start = (activePage - 1) * activePageSize
    return sortedData.slice(start, start + activePageSize)
  }, [activePage, activePageSize, manualPagination, pagination, sortedData])

  const handleSort = useCallback(
    (column: DataTableColumn<T>) => {
      if (!column.sortable) return

      const nextSort: DataTableSort = {
        columnId: column.id,
        direction:
          activeSort?.columnId === column.id && activeSort.direction === 'asc'
            ? 'desc'
            : 'asc',
      }

      if (sort === undefined) {
        setInternalSort(nextSort)
      }

      onSortChange?.(nextSort)
    },
    [activeSort, onSortChange, sort],
  )

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (page === undefined) {
        setInternalPage(nextPage)
      }

      onPageChange?.(nextPage)
    },
    [onPageChange, page],
  )

  const handlePageSizeChange = useCallback(
    (nextPageSize: number) => {
      if (pageSize === undefined) {
        setInternalPageSize(nextPageSize)
      }

      if (page === undefined) {
        setInternalPage(1)
      }

      onPageSizeChange?.(nextPageSize)
      onPageChange?.(1)
    },
    [onPageChange, onPageSizeChange, page, pageSize],
  )

  const firstResult =
    rowCount === 0
      ? 0
      : Math.min((activePage - 1) * activePageSize + 1, rowCount)
  const lastResult = pagination
    ? Math.min(activePage * activePageSize, rowCount)
    : visibleRows.length

  const contextValue = useMemo<DataTableContextValue<T>>(
    () => ({
      activePage,
      activePageSize,
      activeSort,
      columns,
      data,
      emptyMessage,
      firstResult,
      handlePageChange,
      handlePageSizeChange,
      handleSort,
      highlightOnHover,
      lastResult,
      loading,
      manualPagination,
      onRowClick,
      pagination,
      rowCount,
      rowKey,
      selectedRowId,
      visibleRows,
    }),
    [
      activePage,
      activePageSize,
      activeSort,
      columns,
      data,
      emptyMessage,
      firstResult,
      handlePageChange,
      handlePageSizeChange,
      handleSort,
      highlightOnHover,
      lastResult,
      loading,
      manualPagination,
      onRowClick,
      pagination,
      rowCount,
      rowKey,
      selectedRowId,
      visibleRows,
    ],
  )

  return (
    <DataTableContext.Provider
      value={contextValue as unknown as DataTableContextValue<object>}
    >
      {children}
    </DataTableContext.Provider>
  )
}

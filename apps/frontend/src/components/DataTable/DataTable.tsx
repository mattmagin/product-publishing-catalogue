import { Pagination } from '@chakra-ui/react'
import { useDataTableContext } from './DataTableContext'
import { DataTableProvider } from './DataTableProvider'
import { getSortIndicator, renderCell } from './helpers'
import {
  BodyCell,
  BodyRow,
  Controls,
  Footer,
  HeadCell,
  PaginationControls,
  ResultCount,
  Root,
  SortButton,
  SortIndicator,
  StateCell,
  Table,
  TableScroller,
} from './styles'
import type { DataTableProps } from './types'

function DataTable<T extends object>(props: DataTableProps<T>) {
  return (
    <DataTableProvider {...props}>
      <DataTableContent className={props.className} />
    </DataTableProvider>
  )
}

function DataTableContent<T extends object>({
  className,
}: {
  className?: string
}) {
  const {
    activePage,
    activePageSize,
    activeSort,
    columns,
    emptyMessage,
    firstResult,
    handlePageChange,
    handleSort,
    highlightOnHover,
    lastResult,
    loading,
    onRowClick,
    pagination,
    rowCount,
    rowKey,
    selectedRowId,
    visibleRows,
  } = useDataTableContext<T>()

  return (
    <Root className={className}>
      <TableScroller>
        <Table>
          <colgroup>
            {columns.map((column) => (
              <col key={column.id} style={{ width: column.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column) => (
                <HeadCell key={column.id} $align={column.align ?? 'left'}>
                  {column.sortable ? (
                    <SortButton
                      type="button"
                      $align={column.align ?? 'left'}
                      onClick={() => handleSort(column)}
                    >
                      <span>{column.name}</span>
                      <SortIndicator aria-hidden="true">
                        {getSortIndicator(activeSort, column.id)}
                      </SortIndicator>
                    </SortButton>
                  ) : (
                    column.name
                  )}
                </HeadCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <StateCell colSpan={columns.length}>Loading...</StateCell>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <StateCell colSpan={columns.length}>{emptyMessage}</StateCell>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => {
                const rowId = row[rowKey] as string | number | undefined

                return (
                  <BodyRow
                    key={rowId ?? rowIndex}
                    $clickable={Boolean(onRowClick)}
                    $highlightOnHover={highlightOnHover}
                    $selected={selectedRowId != null && rowId === selectedRowId}
                    onClick={(event) => onRowClick?.(row, event)}
                  >
                    {columns.map((column) => (
                      <BodyCell key={column.id} $align={column.align ?? 'left'}>
                        {renderCell(row, rowIndex, column)}
                      </BodyCell>
                    ))}
                  </BodyRow>
                )
              })
            )}
          </tbody>
        </Table>
      </TableScroller>

      {pagination ? (
        <Footer>
          <ResultCount>
            Showing {firstResult} to {lastResult} of {rowCount} rows
          </ResultCount>

          <Controls>
            <Pagination.Root
              count={rowCount}
              pageSize={activePageSize}
              page={activePage}
              onPageChange={(details) => handlePageChange(details.page)}
              siblingCount={1}
            >
              <PaginationControls>
                <Pagination.PrevTrigger>&lt;</Pagination.PrevTrigger>
                <Pagination.Context>
                  {(paginationState) =>
                    paginationState.pages.map((pageItem, index) =>
                      pageItem.type === 'page' ? (
                        <Pagination.Item key={index} {...pageItem}>
                          {pageItem.value}
                        </Pagination.Item>
                      ) : (
                        <Pagination.Ellipsis key={index} index={index}>
                          ...
                        </Pagination.Ellipsis>
                      ),
                    )
                  }
                </Pagination.Context>
                <Pagination.NextTrigger>&gt;</Pagination.NextTrigger>
              </PaginationControls>
            </Pagination.Root>
          </Controls>
        </Footer>
      ) : null}
    </Root>
  )
}

export default DataTable

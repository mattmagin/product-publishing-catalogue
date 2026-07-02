import type {
  DataTableColumn,
  DataTablePrimitive,
  DataTableSort,
} from './types'

export const comparePrimitive = (
  firstValue: DataTablePrimitive,
  secondValue: DataTablePrimitive,
) => {
  if (firstValue == null && secondValue == null) return 0
  if (firstValue == null) return 1
  if (secondValue == null) return -1

  if (typeof firstValue === 'number' && typeof secondValue === 'number') {
    return firstValue - secondValue
  }

  if (typeof firstValue === 'boolean' && typeof secondValue === 'boolean') {
    return Number(firstValue) - Number(secondValue)
  }

  return String(firstValue).localeCompare(String(secondValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export const renderCell = <T extends object>(
  row: T,
  rowIndex: number,
  column: DataTableColumn<T>,
) => {
  if (column.cell) return column.cell(row, rowIndex)

  const value = column.selector?.(row, rowIndex)
  if (value == null) return '-'

  return String(value)
}

export const getSortIndicator = (
  sort: DataTableSort | null,
  columnId: string,
) => {
  if (sort?.columnId !== columnId) return '-'
  return sort.direction === 'asc' ? '^' : 'v'
}

import styled from 'styled-components'
import type { ProductStatus } from '../../store/products'
import { formatStatus } from './catalogueFormatters'

type ProductStatusBadgeProps = {
  status: ProductStatus
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return <StatusBadge $status={status}>{formatStatus(status)}</StatusBadge>
}

const StatusBadge = styled.span<{ $status: ProductStatus }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 22px;
  border: 1px solid
    ${({ $status }) =>
      $status === 'published'
        ? '#86efac'
        : $status === 'scheduled'
          ? '#f8c471'
          : '#d0d5dd'};
  border-radius: 4px;
  padding: 2px 7px;
  background: ${({ $status }) =>
    $status === 'published'
      ? '#dcfce7'
      : $status === 'scheduled'
        ? '#fef3c7'
        : '#f8fafc'};
  color: ${({ $status }) =>
    $status === 'published'
      ? '#166534'
      : $status === 'scheduled'
        ? '#92400e'
        : '#475467'};
  font-size: 12px;
  font-weight: 650;
`

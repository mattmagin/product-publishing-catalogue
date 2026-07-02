import { Select } from '@ark-ui/react/select'
import styled from 'styled-components'
import type { DataTableAlign } from './types'

export const Root = styled.div`
  overflow: hidden;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  background: #ffffff;
`

export const TableScroller = styled.div`
  overflow-x: auto;
  background: #ffffff;
`

export const Table = styled.table`
  width: 100%;
  min-width: 780px;
  border-collapse: collapse;
  color: #111827;
  font-size: 13px;

  th,
  td {
    border-bottom: 1px solid #edf0f5;
    padding: 13px 16px;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`

export const HeadCell = styled.th<{ $align: DataTableAlign }>`
  background: #ffffff;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
  text-align: ${({ $align }) => $align};
`

export const SortButton = styled.button<{ $align: DataTableAlign }>`
  display: inline-flex;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === 'right'
      ? 'flex-end'
      : $align === 'center'
        ? 'center'
        : 'flex-start'};
  gap: 6px;
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid rgba(38, 132, 255, 0.28);
    outline-offset: 3px;
  }
`

export const SortIndicator = styled.span`
  color: #667085;
  font-size: 12px;
`

export const BodyRow = styled.tr<{
  $clickable: boolean
  $highlightOnHover: boolean
  $selected: boolean
}>`
  background: ${({ $selected }) => ($selected ? '#f0f7ff' : '#ffffff')};
  box-shadow: ${({ $selected }) =>
    $selected ? 'inset 3px 0 0 #2684ff' : 'none'};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ $highlightOnHover, $selected }) =>
      $selected ? '#f0f7ff' : $highlightOnHover ? '#f8fafc' : '#ffffff'};
  }
`

export const BodyCell = styled.td<{ $align: DataTableAlign }>`
  text-align: ${({ $align }) => $align};
`

export const StateCell = styled.td`
  padding: 28px 16px;
  color: #667085;
  text-align: center;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-top: 1px solid #edf0f5;
  background: #ffffff;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const ResultCount = styled.div`
  color: #475467;
  font-size: 13px;
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  button,
  [data-part='ellipsis'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    border: 1px solid #d9dee8;
    border-radius: 4px;
    background: #ffffff;
    color: #344054;
    font: inherit;
    font-size: 13px;
  }

  button {
    cursor: pointer;
  }

  button[data-selected] {
    border-color: #2684ff;
    background: #eef6ff;
    color: #0b5cab;
  }

  button:disabled,
  button[data-disabled] {
    opacity: 0.45;
    cursor: default;
  }
`

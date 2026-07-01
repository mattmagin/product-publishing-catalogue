import { Portal } from '@ark-ui/react/portal'
import { Select, createListCollection } from '@ark-ui/react/select'
import styled from 'styled-components'
import type { ProductStatus } from '../../store/products'

export type StatusFilter = ProductStatus | 'all'

type ProductFiltersProps = {
  query: string
  statusFilter: StatusFilter
  onQueryChange: (query: string) => void
  onStatusFilterChange: (status: StatusFilter) => void
}

const statusCollection = createListCollection({
  items: [
    { label: 'All statuses', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Draft', value: 'draft' },
  ],
})

const normalizeStatus = (value: string | undefined): StatusFilter => {
  if (value === 'published' || value === 'scheduled' || value === 'draft') {
    return value
  }

  return 'all'
}

export function ProductFilters({
  query,
  statusFilter,
  onQueryChange,
  onStatusFilterChange,
}: ProductFiltersProps) {
  return (
    <Toolbar>
      <SearchLabel>
        <span>Search products</span>
        <SearchInput
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          placeholder="Search products by title or ID..."
        />
      </SearchLabel>

      <Select.Root
        collection={statusCollection}
        value={[statusFilter]}
        onValueChange={(details) => {
          onStatusFilterChange(normalizeStatus(details.value[0]))
        }}
      >
        <SelectControl>
          <Select.Trigger className="select-trigger">
            <Select.ValueText placeholder="All statuses" />
            <Select.Indicator>v</Select.Indicator>
          </Select.Trigger>
        </SelectControl>
        <Portal>
          <Select.Positioner>
            <SelectContent>
              {statusCollection.items.map((item) => (
                <SelectItem item={item} key={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                </SelectItem>
              ))}
            </SelectContent>
          </Select.Positioner>
        </Portal>
        <Select.HiddenSelect />
      </Select.Root>
    </Toolbar>
  )
}

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #d9dee8;
  border-bottom: 0;
  border-radius: 4px 4px 0 0;
  background: #ffffff;

  @media (max-width: 720px) {
    align-items: stretch;
    flex-direction: column;
  }
`

const SearchLabel = styled.label`
  display: block;
  width: min(360px, 100%);

  span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
`

const SearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 36px;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  padding: 0 12px;
  color: #111827;
  background: #ffffff;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #2684ff;
    box-shadow: 0 0 0 2px rgba(38, 132, 255, 0.16);
  }
`

const SelectControl = styled(Select.Control)`
  min-width: 150px;

  .select-trigger {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    height: 36px;
    border: 1px solid #d9dee8;
    border-radius: 4px;
    padding: 0 12px;
    background: #ffffff;
    color: #111827;
    font-size: 13px;
    cursor: pointer;
  }

  .select-trigger:focus-visible {
    outline: 2px solid rgba(38, 132, 255, 0.28);
    outline-offset: 1px;
  }
`

const SelectContent = styled(Select.Content)`
  min-width: var(--reference-width);
  padding: 4px;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
  z-index: 20;
`

const SelectItem = styled(Select.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 3px;
  padding: 8px 10px;
  color: #111827;
  font-size: 13px;
  cursor: pointer;

  &[data-highlighted] {
    background: #eef6ff;
  }

  &[data-state='checked'] {
    color: #0f766e;
    font-weight: 650;
  }
`

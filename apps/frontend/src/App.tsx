import { DatePicker } from '@ark-ui/react/date-picker'
import { Pagination } from '@ark-ui/react/pagination'
import { Portal } from '@ark-ui/react/portal'
import { Select, createListCollection } from '@ark-ui/react/select'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import productsFixture from './data/products.json'

type ProductStatus = 'draft' | 'scheduled' | 'published'

type ProductHistoryEntry = {
  date: string
  label: string
  description: string
}

type Product = {
  id: string
  title: string
  price: number
  status: ProductStatus
  scheduledPublish: string | null
  imageUrl: string
  history: ProductHistoryEntry[]
}

type StatusFilter = ProductStatus | 'all'

const pageSize = 10

const statusCollection = createListCollection({
  items: [
    { label: 'All statuses', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Draft', value: 'draft' },
  ],
})

const initialProducts = productsFixture as Product[]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const normalizeStatus = (value: string | undefined): StatusFilter => {
  if (value === 'published' || value === 'scheduled' || value === 'draft') {
    return value
  }

  return 'all'
}

const formatPrice = (price: number) => currencyFormatter.format(price)

const formatStatus = (status: ProductStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1)

const todayStamp = () =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())

const formatScheduleValue = (dateValue: string, timeValue: string) => {
  if (!dateValue) return ''

  const date = new Date(`${dateValue}T${timeValue || '00:00'}`)
  if (Number.isNaN(date.getTime())) return dateValue

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [scheduleDate, setScheduleDate] = useState('2025-05-23')
  const [scheduleTime, setScheduleTime] = useState('09:00')

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesQuery =
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.id.toLowerCase().includes(normalizedQuery)
      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [products, query, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )
  const selectedProduct =
    filteredProducts.find((product) => product.id === selectedProductId) ??
    filteredProducts[0] ??
    products[0]

  const updateSelectedProduct = (
    updater: (product: Product) => Product,
  ) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === selectedProduct.id ? updater(product) : product,
      ),
    )
  }

  const addHistory = (
    product: Product,
    label: string,
    description: string,
  ): ProductHistoryEntry[] => [
    {
      date: todayStamp(),
      label,
      description,
    },
    ...product.history,
  ]

  const publishSelectedProduct = () => {
    updateSelectedProduct((product) => ({
      ...product,
      status: 'published',
      scheduledPublish: null,
      history: addHistory(product, 'published', 'Product published immediately.'),
    }))
  }

  const unpublishSelectedProduct = () => {
    updateSelectedProduct((product) => ({
      ...product,
      status: 'draft',
      scheduledPublish: null,
      history: addHistory(product, 'unpublished', 'Product returned to draft state.'),
    }))
  }

  const scheduleSelectedProduct = () => {
    const formattedSchedule = formatScheduleValue(scheduleDate, scheduleTime)
    if (!formattedSchedule) return

    updateSelectedProduct((product) => ({
      ...product,
      status: 'scheduled',
      scheduledPublish: formattedSchedule,
      history: addHistory(
        product,
        'publish scheduled',
        `Publish scheduled for ${formattedSchedule}.`,
      ),
    }))
  }

  const cancelScheduledPublish = () => {
    updateSelectedProduct((product) => ({
      ...product,
      status: 'draft',
      scheduledPublish: null,
      history: addHistory(
        product,
        'schedule cancelled',
        'Scheduled publish was cancelled.',
      ),
    }))
  }

  return (
    <Shell>
      <Content>
        <CataloguePanel aria-labelledby="catalogue-title">
          <Header>
            <div>
              <Title id="catalogue-title">Product Catalogue Publishing</Title>
              <Subtitle>
                Manage when products are visible on the ecommerce website.
              </Subtitle>
            </div>
          </Header>

          <Toolbar>
            <SearchLabel>
              <span>Search products</span>
              <SearchInput
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.currentTarget.value)
                  setPage(1)
                }}
                placeholder="Search products by title or ID..."
              />
            </SearchLabel>

            <Select.Root
              collection={statusCollection}
              value={[statusFilter]}
              onValueChange={(details) => {
                setStatusFilter(normalizeStatus(details.value[0]))
                setPage(1)
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

          <TableWrap>
            <ProductTable>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Scheduled Publish</th>
                  <th aria-label="Open product" />
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    $selected={product.id === selectedProduct.id}
                    onClick={() => setSelectedProductId(product.id)}
                  >
                    <td>
                      <ProductButton type="button">
                        {product.title}
                      </ProductButton>
                    </td>
                    <td>{product.id}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <StatusBadge $status={product.status}>
                        {formatStatus(product.status)}
                      </StatusBadge>
                    </td>
                    <td>{product.scheduledPublish ?? '-'}</td>
                    <td>
                      <RowArrow aria-hidden="true">&gt;</RowArrow>
                    </td>
                  </ProductRow>
                ))}
              </tbody>
            </ProductTable>
          </TableWrap>

          <Footer>
            <ResultCount>
              Showing {visibleProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredProducts.length)} of{' '}
              {filteredProducts.length} products
            </ResultCount>

            <Pagination.Root
              count={filteredProducts.length}
              pageSize={pageSize}
              page={currentPage}
              onPageChange={(details) => setPage(details.page)}
              siblingCount={1}
            >
              <PaginationControls>
                <Pagination.PrevTrigger>&lt;</Pagination.PrevTrigger>
                <Pagination.Context>
                  {(pagination) =>
                    pagination.pages.map((pageItem, index) =>
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
          </Footer>
        </CataloguePanel>

        <DetailsPanel aria-labelledby="selected-product-title">
          <DetailsSection>
            <SectionTitle>Selected Product</SectionTitle>
            <ProductSummary>
              <ProductImage src={selectedProduct.imageUrl} alt="" />
              <div>
                <ProductName id="selected-product-title">
                  {selectedProduct.title}
                </ProductName>
                <ProductId>{selectedProduct.id}</ProductId>
                <DetailLabel>Price</DetailLabel>
                <DetailValue>{formatPrice(selectedProduct.price)}</DetailValue>
                <DetailLabel>Status</DetailLabel>
                <StatusBadge $status={selectedProduct.status}>
                  {formatStatus(selectedProduct.status)}
                </StatusBadge>
              </div>
            </ProductSummary>
          </DetailsSection>

          <DetailsSection>
            <SectionTitle>Actions</SectionTitle>
            <ActionGrid>
              <PrimaryButton type="button" onClick={publishSelectedProduct}>
                Publish now
              </PrimaryButton>
              <SecondaryButton type="button" onClick={unpublishSelectedProduct}>
                Unpublish now
              </SecondaryButton>
            </ActionGrid>

            <ScheduleGroup>
              <FieldLabel>Schedule publish</FieldLabel>
              <ScheduleRow>
                <DatePicker.Root
                  positioning={{ sameWidth: true }}
                  onValueChange={(details) => {
                    const nextDate = details.valueAsString[0]
                    if (nextDate) {
                      setScheduleDate(nextDate)
                    }
                  }}
                >
                  <DatePicker.Control className="date-control">
                    <DatePicker.Input
                      className="date-input"
                      index={0}
                      value={scheduleDate}
                      readOnly
                    />
                    <DatePicker.Trigger className="date-trigger">
                      Calendar
                    </DatePicker.Trigger>
                  </DatePicker.Control>
                  <Portal>
                    <DatePicker.Positioner>
                      <DatePickerContent>
                        <DatePicker.View view="day">
                          <DatePicker.Context>
                            {(datePicker) => (
                              <>
                                <CalendarHeader>
                                  <DatePicker.PrevTrigger>&lt;</DatePicker.PrevTrigger>
                                  <DatePicker.ViewTrigger>
                                    <DatePicker.RangeText />
                                  </DatePicker.ViewTrigger>
                                  <DatePicker.NextTrigger>&gt;</DatePicker.NextTrigger>
                                </CalendarHeader>
                                <DatePicker.Table>
                                  <DatePicker.TableHead>
                                    <DatePicker.TableRow>
                                      {datePicker.weekDays.map((weekDay, id) => (
                                        <DatePicker.TableHeader key={id}>
                                          {weekDay.short}
                                        </DatePicker.TableHeader>
                                      ))}
                                    </DatePicker.TableRow>
                                  </DatePicker.TableHead>
                                  <DatePicker.TableBody>
                                    {datePicker.weeks.map((week, weekIndex) => (
                                      <DatePicker.TableRow key={weekIndex}>
                                        {week.map((day, dayIndex) => (
                                          <DatePicker.TableCell
                                            key={dayIndex}
                                            value={day}
                                          >
                                            <DatePicker.TableCellTrigger>
                                              {day.day}
                                            </DatePicker.TableCellTrigger>
                                          </DatePicker.TableCell>
                                        ))}
                                      </DatePicker.TableRow>
                                    ))}
                                  </DatePicker.TableBody>
                                </DatePicker.Table>
                              </>
                            )}
                          </DatePicker.Context>
                        </DatePicker.View>
                      </DatePickerContent>
                    </DatePicker.Positioner>
                  </Portal>
                </DatePicker.Root>

                <TimeInput
                  type="time"
                  value={scheduleTime}
                  onChange={(event) => setScheduleTime(event.currentTarget.value)}
                />
                <ScheduleButton type="button" onClick={scheduleSelectedProduct}>
                  Schedule
                </ScheduleButton>
              </ScheduleRow>
              <Hint>Set a future date and time for this product to go live.</Hint>
            </ScheduleGroup>

            <ScheduleStatus>
              <span>{selectedProduct.scheduledPublish ?? 'No scheduled publish'}</span>
              <SecondaryButton
                type="button"
                onClick={cancelScheduledPublish}
                disabled={!selectedProduct.scheduledPublish}
              >
                Cancel scheduled publish
              </SecondaryButton>
            </ScheduleStatus>
          </DetailsSection>

          <DetailsSection>
            <SectionTitle>Publishing History</SectionTitle>
            <HistoryList>
              {selectedProduct.history.map((entry, index) => (
                <HistoryItem key={`${entry.date}-${entry.label}-${index}`}>
                  <HistoryDot aria-hidden="true" />
                  <div>
                    <HistoryMeta>
                      <span>{entry.date}</span>
                      <HistoryBadge>{entry.label}</HistoryBadge>
                    </HistoryMeta>
                    <HistoryDescription>{entry.description}</HistoryDescription>
                  </div>
                </HistoryItem>
              ))}
            </HistoryList>
          </DetailsSection>
        </DetailsPanel>
      </Content>
    </Shell>
  )
}

const Shell = styled.main`
  min-height: 100svh;
  box-sizing: border-box;
  padding: 18px;
  background: #f8fafc;
  color: #111827;
`

const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  gap: 16px;
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

const CataloguePanel = styled.section`
  min-width: 0;
`

const Header = styled.header`
  margin-bottom: 18px;
`

const Title = styled.h1`
  margin: 0;
  color: #111827;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 750;
  letter-spacing: 0;
`

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #667085;
  font-size: 13px;
`

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

const TableWrap = styled.div`
  overflow-x: auto;
  border-inline: 1px solid #d9dee8;
  background: #ffffff;
`

const ProductTable = styled.table`
  width: 100%;
  min-width: 780px;
  border-collapse: collapse;
  color: #111827;
  font-size: 13px;

  th,
  td {
    border-bottom: 1px solid #edf0f5;
    padding: 13px 16px;
    text-align: left;
    white-space: nowrap;
  }

  th {
    color: #344054;
    font-size: 12px;
    font-weight: 700;
    background: #ffffff;
  }
`

const ProductRow = styled.tr<{ $selected: boolean }>`
  background: ${({ $selected }) => ($selected ? '#f0f7ff' : '#ffffff')};
  box-shadow: ${({ $selected }) =>
    $selected ? 'inset 3px 0 0 #2684ff' : 'none'};
  cursor: pointer;

  &:hover {
    background: ${({ $selected }) => ($selected ? '#f0f7ff' : '#f8fafc')};
  }
`

const ProductButton = styled.button`
  border: 0;
  padding: 0;
  background: transparent;
  color: #111827;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
`

const RowArrow = styled.span`
  color: #667085;
  font-size: 18px;
`

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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid #d9dee8;
  border-top: 0;
  border-radius: 0 0 4px 4px;
  background: #ffffff;

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const ResultCount = styled.div`
  color: #475467;
  font-size: 13px;
`

const PaginationControls = styled.div`
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

const DetailsPanel = styled.aside`
  overflow: hidden;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  background: #ffffff;
`

const DetailsSection = styled.section`
  padding: 18px 20px;

  & + & {
    border-top: 1px solid #edf0f5;
  }
`

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: #111827;
  font-size: 14px;
  line-height: 1.3;
  font-weight: 750;
`

const ProductSummary = styled.div`
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 18px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ProductImage = styled.img`
  width: 128px;
  aspect-ratio: 1;
  border: 1px solid #d9dee8;
  border-radius: 3px;
  object-fit: cover;
  background: #f8fafc;
`

const ProductName = styled.h3`
  margin: 0 0 5px;
  color: #111827;
  font-size: 17px;
  line-height: 1.25;
  font-weight: 750;
`

const ProductId = styled.div`
  margin-bottom: 14px;
  color: #475467;
  font-size: 13px;
`

const DetailLabel = styled.div`
  margin-top: 10px;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
`

const DetailValue = styled.div`
  margin-top: 3px;
  color: #111827;
  font-size: 13px;
`

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border-radius: 4px;
  padding: 0 14px;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;

  &:disabled {
    opacity: 0.48;
    cursor: default;
  }
`

const PrimaryButton = styled(BaseButton)`
  border: 1px solid #059669;
  background: #059669;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #047857;
  }
`

const SecondaryButton = styled(BaseButton)`
  border: 1px solid #d9dee8;
  background: #ffffff;
  color: #344054;

  &:hover:not(:disabled) {
    background: #f8fafc;
  }
`

const ScheduleGroup = styled.div`
  margin-top: 16px;
`

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
`

const ScheduleRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px auto;
  gap: 8px;

  .date-control {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .date-input,
  .date-trigger {
    min-height: 34px;
    border: 1px solid #d9dee8;
    background: #ffffff;
    color: #111827;
    font: inherit;
    font-size: 13px;
  }

  .date-input {
    min-width: 0;
    border-radius: 4px 0 0 4px;
    padding: 0 10px;
  }

  .date-trigger {
    border-left: 0;
    border-radius: 0 4px 4px 0;
    padding: 0 10px;
    cursor: pointer;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;

    .date-control {
      grid-template-columns: 1fr;
    }

    .date-input,
    .date-trigger {
      border: 1px solid #d9dee8;
      border-radius: 4px;
    }
  }
`

const TimeInput = styled.input`
  min-width: 0;
  min-height: 34px;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  padding: 0 8px;
  background: #ffffff;
  color: #111827;
  font: inherit;
  font-size: 13px;
`

const ScheduleButton = styled(PrimaryButton)`
  min-height: 34px;
`

const Hint = styled.p`
  margin: 6px 0 0;
  color: #667085;
  font-size: 12px;
`

const ScheduleStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  color: #475467;
  font-size: 13px;

  ${SecondaryButton} {
    min-height: 30px;
    font-size: 12px;
  }
`

const DatePickerContent = styled(DatePicker.Content)`
  padding: 12px;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
  z-index: 30;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 6px;
    color: #667085;
    font-size: 11px;
    font-weight: 700;
  }

  td {
    padding: 2px;
  }

  [data-part='cell-trigger'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 30px;
    border-radius: 4px;
    color: #111827;
    font-size: 12px;
    cursor: pointer;
  }

  [data-part='cell-trigger']:hover {
    background: #eef6ff;
  }

  [data-selected] [data-part='cell-trigger'],
  [data-part='cell-trigger'][data-selected] {
    background: #2684ff;
    color: #ffffff;
  }
`

const CalendarHeader = styled(DatePicker.ViewControl)`
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  button {
    min-height: 30px;
    border: 1px solid #d9dee8;
    border-radius: 4px;
    background: #ffffff;
    color: #344054;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }
`

const HistoryList = styled.ol`
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
`

const HistoryItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 10px;
  padding-bottom: 16px;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    bottom: 0;
    left: 4px;
    width: 1px;
    background: #d9dee8;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:last-child::before {
    display: none;
  }
`

const HistoryDot = styled.span`
  position: relative;
  z-index: 1;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 999px;
  background: #111827;
`

const HistoryMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #475467;
  font-size: 12px;
`

const HistoryBadge = styled.span`
  border: 1px solid #d9dee8;
  border-radius: 4px;
  padding: 1px 5px;
  background: #f8fafc;
  color: #344054;
  font-size: 11px;
  font-weight: 650;
`

const HistoryDescription = styled.p`
  margin: 5px 0 0;
  color: #667085;
  font-size: 12px;
  line-height: 1.35;
`

export default App

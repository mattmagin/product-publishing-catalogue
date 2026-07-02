import styled from 'styled-components'
import type { ProductHistoryEntry } from '../../store/products'
import SectionHeading from '../ui/SectionHeading'
import Steps from '../ui/Steps'

type PublishingHistoryProps = {
  history: ProductHistoryEntry[]
  loading: boolean
  error: string | null
}

export function PublishingHistory({
  history,
  loading,
  error,
}: PublishingHistoryProps) {
  const historyItems = history.map(({ value, title, description }) => ({
    value,
    title,
    description,
  }))

  return (
    <DetailsSection>
      <SectionHeading>Publishing History</SectionHeading>
      {loading ? (
        <HistoryState>Loading publishing history...</HistoryState>
      ) : error ? (
        <HistoryError role="alert">
          Publishing history could not be loaded. {error}
        </HistoryError>
      ) : historyItems.length > 0 ? (
        <Steps items={historyItems} />
      ) : (
        <HistoryState>No publishing history has been recorded.</HistoryState>
      )}
    </DetailsSection>
  )
}

const DetailsSection = styled.section`
  padding: 18px 20px;

  & + & {
    border-top: 1px solid #edf0f5;
  }
`

const HistoryState = styled.p`
  margin: 0;
  color: #667085;
  font-size: 13px;
`

const HistoryError = styled.p`
  margin: 0;
  color: #991b1b;
  font-size: 13px;
`

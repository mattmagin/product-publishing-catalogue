import styled from 'styled-components'
import type { ProductHistoryEntry } from '../../store/products'
import SectionHeading from '../ui/SectionHeading'
import Steps from '../ui/Steps'

type PublishingHistoryProps = {
  history: ProductHistoryEntry[]
}

const HistoryItemContainer = () => {
  return (
    <div>
      <span>History Item Title</span>
      <span>History Item Description</span>
    </div>
  )
}

export function PublishingHistory({ history }: PublishingHistoryProps) {
  // TODO: we assume that the backend serves the history in the correct order (most recent first). If this is not the case, we should sort the history items here before passing them to the Steps component.
  const historyItems = history.map(({ title, description }) => ({
    title,
    description,
  }))

  return (
    <DetailsSection>
      <SectionHeading>Publishing History</SectionHeading>
      <Steps items={historyItems} />
    </DetailsSection>
  )
}

const DetailsSection = styled.section`
  padding: 18px 20px;

  & + & {
    border-top: 1px solid #edf0f5;
  }
`

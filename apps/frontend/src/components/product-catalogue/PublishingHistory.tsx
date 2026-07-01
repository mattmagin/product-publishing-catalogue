import styled from 'styled-components'
import type { ProductHistoryEntry } from '../../store/products'

type PublishingHistoryProps = {
  history: ProductHistoryEntry[]
}

export function PublishingHistory({ history }: PublishingHistoryProps) {
  return (
    <DetailsSection>
      <SectionTitle>Publishing History</SectionTitle>
      <HistoryList>
        {history.map((entry, index) => (
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
  )
}

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

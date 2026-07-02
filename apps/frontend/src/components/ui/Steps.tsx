import styled from 'styled-components'

const Container = styled.ol`
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
`

const Item = styled.li`
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

const Dot = styled.span<{ highlightOnHover?: boolean }>`
  position: relative;
  z-index: 1;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 999px;
  background: ${(props) => (props.highlightOnHover ? '#3b82f6' : '#111827')};
`

const HistoryMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: #475467;
  font-size: 12px;
`

const HistoryDescription = styled.p`
  margin: 5px 0 0;
  color: #667085;
  font-size: 12px;
  line-height: 1.35;
`

interface StepsProps {
  items: {
    value: string
    title: string
    description: string
  }[]
  highlightOnHover?: boolean
}

// Future enhancement (if building into design system): Add a prop to allow for vertical or horizontal orientation of the steps.
const Steps: React.FC<StepsProps> = ({
  items,
  highlightOnHover,
}: StepsProps) => {
  return (
    <Container>
      {items.map((item, index) => (
        <Item key={`${item.value}-${index}`}>
          <Dot aria-hidden="true" highlightOnHover={highlightOnHover} />
          <div>
            <HistoryMeta>
              <span>{item.title}</span>
            </HistoryMeta>
            <HistoryDescription>{item.description}</HistoryDescription>
          </div>
        </Item>
      ))}
    </Container>
  )
}

export default Steps

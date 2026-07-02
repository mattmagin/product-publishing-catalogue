import styled from 'styled-components'

interface ProductActionLayoutProps {
  children: React.ReactNode
}

export const ProductActionLayout = ({ children }: ProductActionLayoutProps) => {
  return (
    <DetailsSection>
      <SectionTitle>Actions</SectionTitle>
      {children}
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

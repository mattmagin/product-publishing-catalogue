import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useProductsStore } from '../../store/products'
import SectionHeading from '@/components/SectionHeading'
import Steps from '@/components/Steps'

type PublishingHistoryProps = {
  productId: string
}

export function PublishingHistory({ productId }: PublishingHistoryProps) {
  const product = useProductsStore((state) =>
    state.products.find((product) => product.id === productId),
  )
  const loadProductHistory = useProductsStore(
    (state) => state.loadProductHistory,
  )
  const loading =
    useProductsStore((state) => state.historyLoadingByProductId[productId]) ??
    false
  const error =
    useProductsStore((state) => state.historyErrorByProductId[productId]) ??
    null
  const historyItems = (product?.history ?? []).map(
    ({ value, title, description }) => ({
      value,
      title,
      description,
    }),
  )
  const visibleHistoryItems = historyItems.slice(0, 3)
  const hasMoreHistoryItems = historyItems.length > visibleHistoryItems.length

  useEffect(() => {
    if (!product || product.historyLoaded) return

    void loadProductHistory(product)
  }, [loadProductHistory, product])

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
        <>
          <Steps items={visibleHistoryItems} />
          {hasMoreHistoryItems ? (
            <ShowMoreLink
              to={`/admin/publishing-changelog?product=${encodeURIComponent(productId)}`}
            >
              Show more
            </ShowMoreLink>
          ) : null}
        </>
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

const ShowMoreLink = styled(Link)`
  display: inline-flex;
  margin-top: 12px;
  color: #0b5cab;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid rgba(38, 132, 255, 0.35);
    outline-offset: 3px;
  }
`

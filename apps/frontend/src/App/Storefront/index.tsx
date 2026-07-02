import styled from 'styled-components'
import Header from './Header'
import Products from './Products'
import { PAGE_X_PADDING } from '@/consts'
import ProductsProvider from './ProductsProvider'
import { Container } from '@/components/styled'

// TODO: Pageination
const Storefront: React.FC = () => {
  return (
    <ProductsProvider>
      <PageContainer>
        <Header />
        <Content>
          <Products />
        </Content>
      </PageContainer>
    </ProductsProvider>
  )
}

export default Storefront

const PageContainer = styled.main`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 24px;
`

const Content = styled(Container)`
  padding: 0 ${PAGE_X_PADDING};
`

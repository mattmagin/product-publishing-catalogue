import styled from 'styled-components'
import { LuSettings } from 'react-icons/lu'
import { Link } from 'react-router-dom'
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
        <AdminPortalLink to="/admin" aria-label="Open admin portal">
          <LuSettings aria-hidden="true" />
          <span>Admin</span>
        </AdminPortalLink>
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

const AdminPortalLink = styled(Link)`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #151515;
  color: #ffffff;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 12px 24px rgba(17, 24, 39, 0.22);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #27272a;
  }

  &:focus-visible {
    outline: 3px solid rgba(38, 132, 255, 0.35);
    outline-offset: 3px;
  }

  @media (max-width: 560px) {
    right: 16px;
    bottom: 16px;
  }
`

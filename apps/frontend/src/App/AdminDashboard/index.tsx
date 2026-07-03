import { useState } from 'react'
import styled from 'styled-components'
import { ProductDetails } from './Product/ProductDetails'
import { ProductListTable } from './ProductListTable'
import { ADMIN_NAV_ITEMS } from './adminNavItems'
import Dashboard from '@/components/Dashboard'
import { Container } from '@/components/styled'

const AdminDashboard: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState('')

  return (
    <Dashboard title="Product Publishing Catalogue" navItems={ADMIN_NAV_ITEMS}>
      <Content>
        <ProductListTable
          selectedProductId={selectedProductId || null}
          onProductSelect={setSelectedProductId}
        />
        <ProductDetails selectedProductId={selectedProductId || null} />
      </Content>
    </Dashboard>
  )
}

export default AdminDashboard

const Content = styled(Container)`
  display: grid;
  flex: 1;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) 350px;
  gap: 24px;

  @media (max-width: 980px) {
    grid-template-columns: minmax(0, 1fr);
    overflow-y: auto;
  }
`

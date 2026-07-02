import { useState } from 'react'
import styled from 'styled-components'
import { ProductDetails } from './Product/ProductDetails'
import { ProductListTable } from './ProductListTable'
import Dashboard from '@/components/Dashboard'
import { Container } from '@/components/styled'

const AdminDashboard: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState('')

  return (
    <Dashboard title="Product Publishing Catalogue">
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
  grid-template-columns: 1fr 350px;
  gap: 24px;
`

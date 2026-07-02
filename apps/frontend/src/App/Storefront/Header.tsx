import styled from 'styled-components'
import Logo from '@/components/Logo'
import { DARK_COLOR, PAGE_X_PADDING } from '@/consts'

export const STOREFRONT_HEADER_HEIGHT = '60px'

const Container = styled.header`
  width: 100%;
  height: ${STOREFRONT_HEADER_HEIGHT};
  background: ${DARK_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${PAGE_X_PADDING};
`

const Header = () => {
  return (
    <Container>
      <Logo dimensions={{ height: '35px' }} />
    </Container>
  )
}

export default Header

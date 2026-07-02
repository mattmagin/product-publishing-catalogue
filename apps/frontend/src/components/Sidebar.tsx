import styled from 'styled-components'
import { DEFAULT_Y_PADDING } from '../consts'

const Container = styled.nav`
  width: 100%;
  height: 100%;
  background: #151515;
  display: flex;
  /*align-items: center;*/
  padding: 0 ${DEFAULT_Y_PADDING};
`

const Logo = styled.img`
  filter: invert(1);
  height: 20px;
`

const Sidebar = () => {
  return (
    <Container>
      <Logo src="/logo.webp" />
    </Container>
  )
}

export default Sidebar

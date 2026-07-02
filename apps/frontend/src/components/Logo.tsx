import styled from 'styled-components'

interface Dimensions {
  width?: string
  height?: string
}

const StyledLogo = styled.img<{ dimensions: Dimensions }>`
  filter: invert(1);
  width: ${(props) => props.dimensions.width ?? 'auto'};
  height: ${(props) => props.dimensions.height ?? 'auto'};
  object-fit: contain;
`

interface LogoProps {
  dimensions?: Dimensions
}

const Logo: React.FC<LogoProps> = ({ dimensions = {} }) => {
  return (
    <StyledLogo
      src="/logo.webp"
      alt="Universal Store Logo"
      dimensions={dimensions}
    />
  )
}

export default Logo

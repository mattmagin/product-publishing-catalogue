import { Flex, Text } from '@chakra-ui/react'

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Flex h="60px" px="6" align="center" justify="space-between" bg="#151515">
      <Text fontSize="lg" fontWeight="light" color="#ffffff">
        {title}
      </Text>
    </Flex>
  )
}

export default Header

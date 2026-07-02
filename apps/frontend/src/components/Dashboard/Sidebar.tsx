import { Box, Text, VStack } from '@chakra-ui/react'
import Logo from '@/components/Logo'

export interface NavItem {
  label: string
}

interface SidebarProps {
  navItems: NavItem[]
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  return (
    <Box w="240px" bg="#151515" p="4" gap="10">
      <Logo dimensions={{ width: '75%' }} />
      <VStack align="stretch" mt="5">
        {navItems.map((item) => (
          <Box
            key={item.label}
            px="3"
            py="2"
            borderRadius="lg"
            cursor="pointer"
            _hover={{ bg: 'gray.100' }}
          >
            <Text fontWeight="medium">{item.label}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

export default Sidebar

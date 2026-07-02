import * as React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import Header from '@/App/Storefront/Header'
import Sidebar, { type NavItem } from './Sidebar'

interface LayoutProps {
  title?: string
  navItems?: NavItem[]
  children: React.ReactNode
}

const Dashboard: React.FC<LayoutProps> = ({
  title = 'Dashboard',
  navItems = [],
  children,
}) => {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar navItems={navItems} />

      <Box flex="1">
        <Header />
        <Box h="100%" p="6">
          <Text
            as="h1"
            mb="5"
            color="#111827"
            fontSize="xl"
            fontWeight="700"
          >
            {title}
          </Text>
          {children}
        </Box>
      </Box>
    </Flex>
  )
}

export default Dashboard

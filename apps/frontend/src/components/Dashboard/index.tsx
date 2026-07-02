import * as React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Header from './Header'
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
        <Header title={title} />
        <Box h="100%" p="6">
          {children}
        </Box>
      </Box>
    </Flex>
  )
}

export default Dashboard

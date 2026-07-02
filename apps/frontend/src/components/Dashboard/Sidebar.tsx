import { Box, VStack } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '@/components/Logo'

export interface NavItem {
  label: string
  to: string
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
          <SidebarLink
            key={item.label}
            to={item.to}
            end={item.to === '/admin'}
          >
            {item.label}
          </SidebarLink>
        ))}
      </VStack>
    </Box>
  )
}

const SidebarLink = styled(NavLink)`
  display: block;
  border-radius: 8px;
  padding: 8px 12px;
  color: #d0d5dd;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: #27272a;
    color: #ffffff;
  }

  &.active {
    background: #ffffff;
    color: #111827;
  }
`

export default Sidebar

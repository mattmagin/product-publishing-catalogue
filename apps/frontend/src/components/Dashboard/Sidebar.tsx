import { Box, VStack } from '@chakra-ui/react'
import { LuExternalLink } from 'react-icons/lu'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '@/components/Logo'

export interface NavItem {
  label: string
  to: string
  opensInNewTab?: boolean
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
            end={item.to === '/' || item.to === '/admin'}
            target={item.opensInNewTab ? '_blank' : undefined}
            rel={item.opensInNewTab ? 'noopener noreferrer' : undefined}
          >
            <span>{item.label}</span>
            {item.opensInNewTab ? <LuExternalLink aria-hidden="true" /> : null}
          </SidebarLink>
        ))}
      </VStack>
    </Box>
  )
}

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 8px;
  padding: 8px 12px;
  color: #d0d5dd;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;

  svg {
    flex: 0 0 auto;
    width: 14px;
    height: 14px;
  }

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

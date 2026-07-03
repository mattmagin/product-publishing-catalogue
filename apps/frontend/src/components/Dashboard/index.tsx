import * as React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { LuHistory, LuLayoutDashboard, LuStore } from 'react-icons/lu'
import type { IconType } from 'react-icons'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Header from '@/App/Storefront/Header'

export interface NavItem {
  label: string
  to: string
}

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
    <Box
      h="100vh"
      bg="gray.50"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Header />
      <Box
        as="main"
        display="flex"
        flex="1"
        flexDirection="column"
        minH="0"
        overflow="hidden"
        p="6"
      >
        {navItems.length > 0 ? (
          <AdminNav aria-label="Admin navigation">
            {navItems.map((item) => (
              <AdminNavLink
                key={item.label}
                to={item.to}
                end={item.to === '/' || item.to === '/admin'}
              >
                <AdminNavIcon route={item.to} />
                <span>{item.label}</span>
              </AdminNavLink>
            ))}
          </AdminNav>
        ) : null}
        <Text as="h1" mb="5" color="#111827" fontSize="xl" fontWeight="700">
          {title}
        </Text>
        {children}
      </Box>
    </Box>
  )
}

const ADMIN_NAV_ICONS: Record<string, IconType> = {
  '/': LuStore,
  '/admin': LuLayoutDashboard,
  '/admin/publishing-changelog': LuHistory,
}

function AdminNavIcon({ route }: { route: string }) {
  const Icon = ADMIN_NAV_ICONS[route] ?? LuLayoutDashboard

  return <Icon aria-hidden="true" />
}

const AdminNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 22px;
`

const AdminNavLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  background: #151515;
  color: #ffffff;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 22px rgba(17, 24, 39, 0.2);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #27272a;
    color: #ffffff;
  }

  &.active {
    background: #151515;
    color: #ffffff;
    box-shadow:
      0 10px 22px rgba(17, 24, 39, 0.2),
      0 0 0 3px rgba(38, 132, 255, 0.28);
  }

  &:focus-visible {
    outline: 3px solid rgba(38, 132, 255, 0.28);
    outline-offset: 2px;
  }
`

export default Dashboard

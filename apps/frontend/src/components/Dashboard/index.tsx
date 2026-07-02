import * as React from 'react'
import { Box, Text } from '@chakra-ui/react'
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
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Box h="100%" p="6">
        {navItems.length > 0 ? (
          <AdminNav aria-label="Admin navigation">
            {navItems.map((item) => (
              <AdminNavLink
                key={item.label}
                to={item.to}
                end={item.to === '/' || item.to === '/admin'}
              >
                {item.label}
              </AdminNavLink>
            ))}
          </AdminNav>
        ) : null}
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
  )
}

const AdminNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
`

const AdminNavLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  border: 1px solid #d9dee8;
  border-radius: 6px;
  background: #ffffff;
  color: #344054;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    border-color: #b8c0cc;
    background: #f8fafc;
    color: #111827;
  }

  &.active {
    border-color: #2684ff;
    background: #eef6ff;
    color: #0b5cab;
  }

  &:focus-visible {
    outline: 3px solid rgba(38, 132, 255, 0.28);
    outline-offset: 2px;
  }
`

export default Dashboard

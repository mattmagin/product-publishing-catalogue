import type { NavItem } from '@/components/Dashboard/Sidebar'

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: 'Published Catalogue',
    to: '/',
  },
  {
    label: 'Dashboard',
    to: '/admin',
  },
  {
    label: 'Publishing Changelog',
    to: '/admin/publishing-changelog',
  },
]

import { BrowserRouter } from 'react-router-dom'
import Storefront from './Storefront'
import AdminDashboard from './AdminDashboard'
import KeyboardShortcuts from './KeyboardShortcuts'
import Routes, { type AppRoute } from '@/components/Routes'
import Toaster from '@/components/Toaster'

const ROUTES: AppRoute[] = [
  {
    path: '/',
    Component: Storefront,
  },
  {
    path: 'admin',
    Component: AdminDashboard,
  },
] as const

function App() {
  return (
    <BrowserRouter>
      <KeyboardShortcuts />
      <Toaster />
      <Routes routes={ROUTES} />
    </BrowserRouter>
  )
}

export default App

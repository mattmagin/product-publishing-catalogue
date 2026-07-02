import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const isEditableElement = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) return false

  return (
    element.isContentEditable ||
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  )
}

// TODO: Tests required in future
const KeyboardShortcuts: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location

  const shortcuts = useMemo(() => {
    return {
      Space: {
        default: () => {
          // TODO: pull from ROUTES
          navigate(pathname === '/admin' ? '/' : '/admin')
        },
      },
    }
  }, [navigate, pathname])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const shortcutActions = shortcuts[event.code]

      // TODO: implement other modifiers
      // event.altKey, event.ctrlKey, event.metaKey, event.shiftKey

      if (isEditableElement(event.target) || !shortcutActions) return
      event.preventDefault()

      shortcutActions.default()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [location.pathname, navigate, shortcuts])

  return null
}

export default KeyboardShortcuts

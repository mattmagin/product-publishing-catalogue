import type { ReactNode } from 'react'
import { Button, Dialog as ChakraDialog, Portal } from '@chakra-ui/react'

interface DialogProps {
  isOpen: boolean
  title: string
  children: ReactNode
  submit: {
    text: string
    callback: () => void
    color: string
    isDisabled: boolean
  }
  cancel: {
    text: string
    callback: () => void
    isDisabled: boolean
  }
}

const Dialog = ({ isOpen, title, children, submit, cancel }: DialogProps) => {
  return (
    <ChakraDialog.Root open={isOpen}>
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content>
            <ChakraDialog.Header>
              <ChakraDialog.Title>{title}</ChakraDialog.Title>
            </ChakraDialog.Header>
            <ChakraDialog.Body>{children}</ChakraDialog.Body>
            <ChakraDialog.Footer>
              <Button
                type="button"
                variant="outline"
                disabled={cancel.isDisabled}
                onClick={cancel.callback}
              >
                {cancel.text}
              </Button>
              <Button
                type="button"
                colorPalette={submit.color || 'green'}
                disabled={submit.isDisabled}
                onClick={submit.callback}
              >
                {submit.text}
              </Button>
            </ChakraDialog.Footer>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  )
}

export default Dialog

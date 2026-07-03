import type { ReactNode } from 'react'
import { Alert as ChakraAlert, type AlertRootProps } from '@chakra-ui/react'

interface AlertProps {
  status?: AlertRootProps['status']
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

const Alert: React.FC<AlertProps> = ({
  status,
  title,
  description,
  action,
}) => {
  return (
    <ChakraAlert.Root status={status}>
      <ChakraAlert.Indicator />
      <ChakraAlert.Content>
        <ChakraAlert.Title>{title}</ChakraAlert.Title>
        {description ? (
          <ChakraAlert.Description>{description}</ChakraAlert.Description>
        ) : null}
        {action ? <AlertActionRow>{action}</AlertActionRow> : null}
      </ChakraAlert.Content>
    </ChakraAlert.Root>
  )
}

const AlertActionRow = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}

export default Alert

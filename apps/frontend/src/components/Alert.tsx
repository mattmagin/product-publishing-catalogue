import { Alert as ChakraAlert, type AlertRootProps } from '@chakra-ui/react'

interface AlertProps {
  status?: AlertRootProps['status']
  children: string
}

const Alert: React.FC<AlertProps> = ({ status, children }) => {
  return (
    <ChakraAlert.Root status={status} title={children}>
      <ChakraAlert.Indicator />
      <ChakraAlert.Title>{children}</ChakraAlert.Title>
    </ChakraAlert.Root>
  )
}

export default Alert

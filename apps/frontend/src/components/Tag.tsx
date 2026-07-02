import { Tag as ChakraTag, type TagRootProps } from '@chakra-ui/react'

interface TagProps extends TagRootProps {
  children: React.ReactNode
}

const Tag: React.FC<TagProps> = ({ children, ...rest }) => {
  return (
    <ChakraTag.Root {...rest}>
      <ChakraTag.Label>{children}</ChakraTag.Label>
    </ChakraTag.Root>
  )
}

export const PublishedTag = () => {
  return <Tag colorPalette="green">Published</Tag>
}

export const UnpublishedTag = () => {
  return <Tag>Unpublished</Tag>
}

export const ScheduledTag = () => {
  return <Tag colorPalette="yellow">Scheduled</Tag>
}

export default Tag

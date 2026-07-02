import { Field, Input } from '@chakra-ui/react'

const TextInput = () => {
  return (
    <Field.Root>
      <Field.Label />
      <Input />
      <Field.HelperText />
    </Field.Root>
  )
}

export default TextInput

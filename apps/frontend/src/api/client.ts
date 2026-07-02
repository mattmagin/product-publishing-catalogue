import ky, { HTTPError } from 'ky'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

const prefixUrl = apiBaseUrl.startsWith('http')
  ? apiBaseUrl
  : `${window.location.origin}${apiBaseUrl}`

export const apiClient = ky.create({
  prefix: prefixUrl,
})

export const apiErrorMessage = (error: unknown) => {
  if (error instanceof HTTPError) {
    return `Request failed with status ${error.response.status}`
  }

  return error instanceof Error ? error.message : 'Unable to contact the API.'
}

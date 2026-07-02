import ky, { HTTPError } from 'ky'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'

const prefixUrl = apiBaseUrl.startsWith('http')
  ? apiBaseUrl
  : `${window.location.origin}${apiBaseUrl}`

export const apiClient = ky.create({
  prefix: prefixUrl,
})

export const apiErrorMessage = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const body = await error.response
      .clone()
      .json()
      .catch(() => null)

    if (
      body &&
      typeof body === 'object' &&
      'error' in body &&
      typeof body.error === 'string'
    ) {
      return body.error
    }

    return `Request failed with status ${error.response.status}`
  }

  return error instanceof Error ? error.message : 'Unable to contact the API.'
}

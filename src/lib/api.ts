export const api = async (
  method = 'GET',
  slug = '',
  data = {},
  headers = {}
) => {
  try {
    const config: RequestInit = {
      method,
      headers: { ...headers },
      redirect: 'follow',
      cache: 'no-store',
      credentials: 'include',
    }

    if (method !== 'GET') {
      config.body = JSON.stringify(data)
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${slug}`
    const response = await fetch(url, config)
    return response
  } catch (error: unknown) {
    console.error(error)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          message: 'Request timed out',
          status: 400,
        }
      } else if (error.message === 'Failed to fetch') {
        return {
          message: 'Connection timed out! Network Error',
          status: 400,
        }
      }

      let errorMessage = error.message || 'An unknown error occurred'
      let status = 400

      if (isErrorWithJson(error)) {
        try {
          const errorResponse = await error.json()
          errorMessage = errorResponse.message || errorMessage
          status = error.status || status
        } catch (jsonError) {
          console.error('Failed to parse error response', jsonError)
        }
      }

      return {
        message: errorMessage,
        status,
      }
    }

    return {
      message: 'An unknown error occurred',
      status: 400,
    }
  }
}

function isErrorWithJson(error: unknown): error is ErrorWithJson {
  return (
    error instanceof Error &&
    'json' in error &&
    typeof (error as ErrorWithJson).json === 'function'
  )
}

interface ErrorWithJson extends Error {
  json: () => Promise<{ message?: string }>
  status?: number
}

import { useEffect } from 'react'
import { APIError } from 'api/MainApi'

export const UnhandledError = {
  message: 'Cannot handle error data.',
  code: 400,
}

type UseAsyncAction = <T>(
  response: T,
  handlers: {
    onFulfilled?: (response: T) => void
    onRejected?: (error: APIError) => void
    onPending?: () => void
  },
) => void

export const useAsyncAction: UseAsyncAction = (response, handlers) => {
  useEffect(() => {
    if (response) {
      handlers.onFulfilled?.(response)
    }
  }, [response])
}

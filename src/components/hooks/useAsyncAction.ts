import { useEffect, useMemo } from 'react'

import { ErrorObject } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'

export const UnhandledError = [
  {
    msg: 'Cannot handle error data.',
  },
]

type UseAsyncAction = <T>(
  response: { data: T; status: APIStatus; errors: ErrorObject[] },
  handlers: {
    onFulfilled?: (data: T) => void
    onRejected?: (errors: ErrorObject[]) => void
    onPending?: () => void
  },
) => void

export const useAsyncAction: UseAsyncAction = (
  { data, status, errors },
  { onPending, onRejected, onFulfilled },
) => {
  useEffect(() => {
    if (status === APIStatus.PENDING && onPending) {
      onPending()
    }
  }, [status, onPending])

  useEffect(() => {
    if (status === APIStatus.REJECTED && onRejected) {
      onRejected(errors.length ? errors : UnhandledError)
    }
  }, [errors, status, onRejected])

  useEffect(() => {
    if (status === APIStatus.FULFILLED && onFulfilled) {
      onFulfilled(data)
    }
  }, [data, status, onFulfilled])
}

// --------------------- using example --------------------
// useAsyncAction(
//   {
//     data: albums,
//     status,
//     errors,
//   },
//   useMemo(() => ({
//     onFulfilled: (data) => {
//       // do something with data
//     },
//     onRejected: (errors) => {
//       //handle errors
//     },
//     onPending: () => {
//       // do something while pending
//     },
//   })),
// )

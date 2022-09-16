/* eslint-disable no-prototype-builtins */
export type APIError = {
  message: string
  code: number
}

export type ErrorResponse = {
  data: {
    message: string
  }
  status: number
}

export const InternalError = {
  message: 'Internal Error',
  code: 500,
}

export const getExceptionPayload = (ex: unknown): APIError => {
  if (typeof ex !== 'object' || !ex) {
    return InternalError
  }

  const exception = ex as { response: ErrorResponse }

  if (ex.hasOwnProperty('response') && typeof exception.response === 'object') {
    const res = exception.response as ErrorResponse

    if (
      res.hasOwnProperty('data') &&
      typeof res.data === 'object' &&
      res.data.hasOwnProperty('message') &&
      typeof res.data.message === 'string' &&
      res.hasOwnProperty('status') &&
      typeof res.status === 'number'
    ) {
      return {
        message: res.data.message,
        code: res.status,
      }
    }
  }

  return InternalError
}

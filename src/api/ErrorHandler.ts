/* eslint-disable no-prototype-builtins */
export type ErrorResponse = {
  response: {
    data: {
      errors: ErrorObject[]
    }
  }
}

export type ErrorObject = {
  value?: string
  msg: string
  param?: string
  location?: string
}

export const InternalError = [
  {
    msg: 'Internal Error',
  },
]

export const getExceptionPayload = (exception: unknown): ErrorObject[] => {
  if (typeof exception !== 'object' || !exception) {
    return InternalError
  }

  const ex = exception as ErrorResponse

  if (
    ex.hasOwnProperty('response') &&
    typeof ex.response === 'object' &&
    ex.response.hasOwnProperty('data') &&
    typeof ex.response.data === 'object' &&
    ex.response.data.hasOwnProperty('errors') &&
    ex.response.data.errors
  ) {
    return ex.response.data.errors
  }

  return InternalError
}

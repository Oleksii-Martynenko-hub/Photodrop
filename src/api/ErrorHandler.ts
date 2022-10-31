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

export const getExceptionPayload = (exception: any): ErrorObject[] => {
  if (typeof exception !== 'object' || !exception) {
    return InternalError
  }

  const ex = exception as ErrorResponse

  if (
    ex.hasOwnProperty('response') &&
    typeof ex.response === 'object' &&
    ex.response.hasOwnProperty('errors')
  ) {
    const res = ex.response
    const { errors } = res as unknown as { errors: ErrorObject[] }
    return errors
  }

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

  if (exception.message && exception.response.statusText)
    return [{ msg: exception.message + ': ' + exception.response.statusText }]

  if (exception.message) return [{ msg: exception.message }]

  return InternalError
}

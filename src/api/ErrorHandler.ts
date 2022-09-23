/* eslint-disable no-prototype-builtins */
export type ErrorResponse = {
  data: {
    errors: ErrorObject[]
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

export const getExceptionPayload = (ex: unknown): ErrorObject[] => {
  if (typeof ex !== 'object' || !ex) {
    return InternalError
  }

  const res = ex as ErrorResponse

  if (
    res.hasOwnProperty('data') &&
    typeof res.data === 'object' &&
    res.data.hasOwnProperty('errors') &&
    res.data.errors
  ) {
    return res.data.errors
  }

  return InternalError
}

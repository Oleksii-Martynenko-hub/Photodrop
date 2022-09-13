/* eslint-disable no-prototype-builtins */
import HttpClient from 'api/HttpClient'
import { LoginData } from 'store/login/reducers'
import { TokensData } from 'utils/local-storage/tokens'

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

export enum APIStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED',
}

export type APIError = {
  message: string
  code: number
}

export const InternalError = {
  message: 'Internal Error',
  code: 500,
}

export const getExceptionPayload = (ex: unknown): APIError => {
  if (typeof ex !== 'object' || !ex) {
    return InternalError
  }

  const typedException = ex as APIError
  if (
    ex.hasOwnProperty('message') &&
    typeof typedException.message === 'string' &&
    ex.hasOwnProperty('code') &&
    typeof typedException.code === 'number'
  ) {
    return {
      message: typedException.message,
      code: typedException.code,
    }
  }

  return InternalError
}

class MainApi extends HttpClient {
  private static classInstance?: MainApi

  public constructor() {
    super(API_URL)
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new MainApi()
    }

    return this.classInstance
  }

  public postLogin = (loginData: LoginData) => this.instance.post<TokensData>('/login', loginData)
}

export default MainApi

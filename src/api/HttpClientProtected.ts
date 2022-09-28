/* eslint-disable @typescript-eslint/no-empty-interface */
import HttpClient from 'api/HttpClient'
import axios, { AxiosRequestConfig } from 'axios'
import Tokens from 'utils/local-storage/tokens'

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClientProtected extends HttpClient {
  protected constructor(baseURL: string) {
    super(baseURL)

    this.initializeRequestInterceptor()
  }

  private initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this.handleRequest)
    this.instance.interceptors.response.use((data) => data, this.handleResponseError)
  }

  private handleRequest = (config: AxiosRequestConfig) => {
    const tokens = Tokens.getInstance()

    const token = tokens.getToken()

    const modifiedConfig = config

    if (!modifiedConfig.headers) {
      modifiedConfig.headers = { Authorization: `Bearer ${token}` }
    }
    modifiedConfig.headers.Authorization = `Bearer ${token}`

    return config
  }

  private handleResponseError = async (e: any): Promise<any> => {
    const status = e.response ? e.response.status : null
    const msg = e?.response?.data?.errors?.[0].msg

    const tokens = Tokens.getInstance()

    const currentToken = tokens.getToken()

    if (
      (msg === 'Forbidden' || msg === 'Not authorized' || msg === 'Token was expired') &&
      currentToken
    ) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
        }
        await axios.get<any>(`${process.env.API}/get-albums-from-db`, config)
      } catch (_) {
        tokens.clearTokens()

        return Promise.reject(e)
      }
    }

    return Promise.reject(e)
  }
}

export default HttpClientProtected

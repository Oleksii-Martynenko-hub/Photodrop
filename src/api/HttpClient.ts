/* eslint-disable @typescript-eslint/no-empty-interface */
import axios, { AxiosInstance, AxiosResponse } from 'axios'

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClient {
  protected readonly instance: AxiosInstance

  protected constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.initializeResponseInterceptor()
  }

  private initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(this.handleResponseSuccess, this.handleResponseRejected)
  }

  private handleResponseSuccess = ({ data }: AxiosResponse) => data

  private handleResponseRejected = async (e: any): Promise<any> => {
    return Promise.reject(e.response)
  }
}

export default HttpClient

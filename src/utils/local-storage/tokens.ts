import LocalStorage from './local-storage'

enum Locals {
  TOKEN = 'token',
}



export default class Tokens extends LocalStorage<Locals> {
  private static instance?: Tokens

  private constructor() {
    super()
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Tokens()
    }

    return this.instance
  }

  public getToken() {
    return this.get(Locals.TOKEN)
  }

  public setToken(accessToken: string) {
    this.set(Locals.TOKEN, accessToken)
  }

  public clearTokens() {
    this.clearItems([Locals.TOKEN])
  }
}

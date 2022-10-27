import { createSlice } from '@reduxjs/toolkit'
import jwt from 'jwt-decode'

import { APIStatus } from 'api/MainApi'
import { ErrorObject } from 'api/ErrorHandler'

import Tokens from 'utils/local-storage/tokens'

export type TokenDecodeData = {
  id: string
  login: string
  iat: number
  exp: number
}

export interface UsersState {
  id: string | undefined
  login: string | undefined
  status: APIStatus
  errors: ErrorObject[]
}

const initialState: UsersState = {
  id: undefined,
  login: undefined,
  status: APIStatus.IDLE,
  errors: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state) => {
      state.status = APIStatus.PENDING

      const tokens = Tokens.getInstance()
      const token = tokens.getToken()

      if (token) {
        const { id, login } = jwt<TokenDecodeData>(token)
        state.id = id
        state.login = login
        state.status = APIStatus.FULFILLED
        return
      }
      state.status = APIStatus.REJECTED
    },
    clearUserState: () => initialState,
  },
})

export const { setUserData, clearUserState } = userSlice.actions

export default userSlice.reducer

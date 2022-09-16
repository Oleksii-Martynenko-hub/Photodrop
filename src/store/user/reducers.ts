import { createSlice } from '@reduxjs/toolkit'
import jwt from 'jwt-decode'

import { APIStatus } from 'api/MainApi'

import Tokens from 'utils/local-storage/tokens'
import { APIError } from 'api/ErrorHandler'

export type TokenDecodeData = {
  id: number
  login: string
  iat: number
  exp: number
}

export interface UsersState {
  id: number | undefined
  login: string | undefined
  status: APIStatus
  error: APIError
}

const initialState: UsersState = {
  id: undefined,
  login: undefined,
  status: APIStatus.IDLE,
  error: {
    message: '',
    code: 0,
  },
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

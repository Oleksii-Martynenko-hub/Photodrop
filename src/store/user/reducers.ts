import { createSlice } from '@reduxjs/toolkit'
import jwt from 'jwt-decode'

import { APIStatus } from 'api/MainApi'

import Tokens from 'utils/local-storage/tokens'

export type TokenDecodeData = {
  id: number
  login: string
  iat: number
  exp: number
}

interface UsersState {
  id: number | undefined
  login: string | undefined
  status: APIStatus
}

const initialState: UsersState = {
  id: undefined,
  login: undefined,
  status: APIStatus.IDLE,
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
  },
})

export const { setUserData } = userSlice.actions

export default userSlice.reducer

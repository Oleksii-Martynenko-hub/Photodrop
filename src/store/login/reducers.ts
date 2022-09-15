import { createSlice } from '@reduxjs/toolkit'

import { APIError } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'

import { loginAsync } from 'store/login/actions'

import Tokens from 'utils/local-storage/tokens'



interface LoginState {
  isLoggedIn: boolean
  status: APIStatus
  error: APIError
}

const initialState: LoginState = {
  isLoggedIn: false,
  status: APIStatus.IDLE,
  error: {
    message: '',
    code: 0,
  },
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    clearToken: () => {
      const tokens = Tokens.getInstance()
      tokens.clearTokens()
    },
    clearLoginState: () => initialState,
    checkToken: (state) => {
      const tokens = Tokens.getInstance()

      if (tokens.getToken()) {
        state.isLoggedIn = true
        state.status = APIStatus.FULFILLED
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state) => {
      state.status = APIStatus.PENDING
    })
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      const tokens = Tokens.getInstance()

      tokens.setToken(action.payload.token)

      state.isLoggedIn = true
      state.status = APIStatus.FULFILLED
    })
    builder.addCase(loginAsync.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.payload
        state.status = APIStatus.REJECTED
      }
    })
  },
})

export const { clearToken, clearLoginState, checkToken } = loginSlice.actions

export default loginSlice.reducer

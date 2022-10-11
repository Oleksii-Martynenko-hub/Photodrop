import { createSlice } from '@reduxjs/toolkit'

import { ErrorObject } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'

import { pendingCase, rejectedCase } from 'store'
import { loginAsync } from 'store/login/actions'

import Tokens from 'utils/local-storage/tokens'

export interface LoginState {
  isLoggedIn: boolean
  status: APIStatus
  errors: ErrorObject[]
}

const initialState: LoginState = {
  isLoggedIn: false,
  status: APIStatus.IDLE,
  errors: [],
}

export const errorToast = (msg: string) =>
  [
    msg === 'Not authorized' ? 'Your login has expired, please login again' : msg,
    {
      position: 'top-center',
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      autoClose: 3000,
      progress: undefined,
    },
  ] as const

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
    setLoginStatus: (state, action: { payload: APIStatus }) => {
      state.status = action.payload
    },
    setIsLoggedIn: (state, action: { payload: boolean }) => {
      state.isLoggedIn = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, pendingCase())
    builder.addCase(loginAsync.rejected, rejectedCase())
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      const tokens = Tokens.getInstance()

      tokens.setToken(action.payload.token)

      state.isLoggedIn = true
      state.status = APIStatus.FULFILLED
    })
  },
})

export const { clearToken, clearLoginState, checkToken, setLoginStatus, setIsLoggedIn } =
  loginSlice.actions

export default loginSlice.reducer

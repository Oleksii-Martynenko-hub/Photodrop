import { createAsyncThunk } from '@reduxjs/toolkit'

import { LoginData, TokensData } from 'api/MainApi'
import { getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'
import { clearUserState } from 'store/user/reducers'
import { clearAlbumsState } from 'store/albums/reducers'
import { clearLoginState, clearToken } from 'store/login/reducers'


export const loginAsync = createAsyncThunk<TokensData, LoginData, ThunkExtra>(
  'login/loginAsync',
  async (loginData, { rejectWithValue, extra: { mainApi } }) => {
    try {
      const response = await mainApi.postLogin(loginData)

      return response
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const logoutAsync = createAsyncThunk(
  'login/logoutAsync',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(clearToken())
      dispatch(clearLoginState())
      dispatch(clearUserState())
      dispatch(clearAlbumsState())

      return new Promise(() => ({}))
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

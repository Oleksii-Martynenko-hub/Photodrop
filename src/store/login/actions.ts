import { createAsyncThunk } from '@reduxjs/toolkit'

import { getExceptionPayload } from 'api/ErrorHandler'
import { LoginData, TokensData } from 'api/MainApi'

import { ThunkExtra } from 'store'


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

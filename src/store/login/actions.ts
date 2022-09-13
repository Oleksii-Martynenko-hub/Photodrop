import { createAsyncThunk } from '@reduxjs/toolkit'

import { getExceptionPayload } from 'api/MainApi'

import { ThunkExtra } from 'store'
import { LoginData } from 'store/login/reducers'

import { TokensData } from 'utils/local-storage/tokens'

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

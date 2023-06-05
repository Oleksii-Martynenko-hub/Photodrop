import { createAsyncThunk } from '@reduxjs/toolkit'

import { APIStatus, LoginData, TokensData } from 'api/MainApi'
import { ErrorObject, getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'
import { clearUserState } from 'store/user/reducers'
import { clearAlbumsState } from 'store/albums/reducers'
import { clearPhotosState } from 'store/photos/reducers'
import { clearLoginState, clearToken, setIsLoggedIn, setLoginStatus } from 'store/login/reducers'
import Tokens from 'utils/local-storage/tokens'

export const logoutIfTokenInvalid = createAsyncThunk<void, unknown, ThunkExtra>(
  'login/logoutIfTokenInvalid',
  async (errorData, { rejectWithValue, dispatch }) => {
    try {
      const ex = errorData as any
      let msg = ''

      if (ex && ex.response) {
        if (ex.response.data && ex.response.data.errors) {
          msg = ex.response.data.errors[0].msg
        }
        if (ex.response.errors) {
          msg = ex.response.errors[0].msg
        }
      }

      if (msg === 'Not authorized' || msg === 'Photographer with this id does not exist') {
        dispatch(logoutAsync())
      }
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const restoreAuthAsync = createAsyncThunk<void, void, ThunkExtra>(
  'login/restoreAuthAsync',
  async (_, { rejectWithValue, extra: { protectedApi }, dispatch }) => {
    try {
      const tokens = Tokens.getInstance()
      const token = tokens.getToken()

      if (!token) return

      dispatch(setLoginStatus(APIStatus.PENDING))

      await protectedApi.getMe()
      dispatch(setIsLoggedIn(true))

      dispatch(setLoginStatus(APIStatus.FULFILLED))
    } catch (error) {
      dispatch(setLoginStatus(APIStatus.REJECTED))

      dispatch(logoutIfTokenInvalid(error))
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

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
      dispatch(clearPhotosState())

      return new Promise(() => ({}))
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

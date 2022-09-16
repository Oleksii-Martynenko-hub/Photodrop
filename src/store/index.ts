import { configureStore } from '@reduxjs/toolkit'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import logger from 'redux-logger'

import MainApi, { APIStatus } from 'api/MainApi'
import ProtectedApi from 'api/ProtectedApi'
import { APIError } from 'api/ErrorHandler'

import loginReducer, { LoginState } from 'store/login/reducers'
import userReducer, { UsersState } from 'store/user/reducers'
import albumsReducer, { AlbumsState } from 'store/albums/reducers'

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
})

const mainApi = MainApi.getInstance()
const protectedApi = ProtectedApi.getInstance()

export type ThunkExtra = {
  state: RootState
  rejectValue: APIError
  extra: {
    mainApi: MainApi
    protectedApi: ProtectedApi
  }
}

export const apis = {
  mainApi,
  protectedApi,
}

export const pendingCase = (callback?: VoidFunction) => (state: CommonState) => {
  state.status = APIStatus.PENDING
  if (callback) callback()
}
export const rejectedCase =
  (callback?: VoidFunction) => (state: CommonState, action: { payload: APIError | undefined }) => {
    if (action.payload) state.error = action.payload
    state.status = APIStatus.REJECTED
    if (callback) callback()
  }

export const store = configureStore({
  reducer: {
    router: routerReducer,
    loginReducer,
    userReducer,
    albumsReducer,
  },
  middleware: (gDM) =>
    gDM({
      thunk: { extraArgument: apis },
    }).concat(
      process.env.NODE_ENV === 'production' ? [routerMiddleware] : [routerMiddleware, logger],
    ),
  devTools: process.env.NODE_ENV !== 'production',
})

export const history = createReduxHistory(store)

export type CommonState = LoginState | UsersState | AlbumsState
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

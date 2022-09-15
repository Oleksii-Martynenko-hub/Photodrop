import { configureStore } from '@reduxjs/toolkit'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import logger from 'redux-logger'

import MainApi from 'api/MainApi'
import ProtectedApi from 'api/ProtectedApi'
import { APIError } from 'api/ErrorHandler'

import loginReducer from 'store/login/reducers'
import userReducer from 'store/user/reducers'
import albumsReducer from 'store/albums/reducers'

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
    }).concat(routerMiddleware, logger),
  devTools: process.env.NODE_ENV !== 'production',
})

export const history = createReduxHistory(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

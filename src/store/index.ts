import { configureStore } from '@reduxjs/toolkit'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'
import logger from 'redux-logger'

import MainApi, { APIStatus } from 'api/MainApi'
import ProtectedApi from 'api/ProtectedApi'
import { ErrorObject } from 'api/ErrorHandler'

import loginReducer, { LoginState } from 'store/login/reducers'
import userReducer, { UsersState } from 'store/user/reducers'
import albumsReducer, { AlbumsState } from 'store/albums/reducers'
import photosReducer, { PhotosState } from 'store/photos/reducers'
import StorageApi from 'api/StorageApi'

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
})

const mainApi = MainApi.getInstance()
const protectedApi = ProtectedApi.getInstance()
const storageApi = StorageApi.getInstance()

export type ThunkExtra = {
  state: RootState
  rejectValue: ErrorObject[]
  extra: {
    mainApi: MainApi
    protectedApi: ProtectedApi
    storageApi: StorageApi
  }
}

export const apis = {
  mainApi,
  protectedApi,
  storageApi,
}

type CaseCallback = (state: CommonState, action: { payload: ErrorObject[] | undefined }) => void

export const pendingCase = (callback?: VoidFunction) => (state: CommonState) => {
  state.status = APIStatus.PENDING
  if (callback) callback()
}
export const rejectedCase =
  (callback?: CaseCallback) =>
  (state: CommonState, action: { payload: ErrorObject[] | undefined }) => {
    if (action.payload) state.errors = action.payload

    state.status = APIStatus.REJECTED
    if (callback) callback(state, action)
  }

export const store = configureStore({
  reducer: {
    router: routerReducer,
    loginReducer,
    userReducer,
    albumsReducer,
    photosReducer,
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

export type CommonState = LoginState | UsersState | AlbumsState | PhotosState
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

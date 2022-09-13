import { Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HistoryRouter } from 'redux-first-history/rr6'
import { Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material'

import { theme } from 'themes/palette'

import { AppBar } from 'components/AppBar'

import Login from 'pages/Login'
import Albums from 'pages/Albums'
import { GlobalStyles } from 'themes/global'
import ProtectedRoute from 'components/ProtectedRoute'
import CurrentAlbum from './CurrentAlbum'
import NewAlbum from './NewAlbum'

import { store, history } from 'store'

export enum ERoutes {
  NOT_EXIST = '*',
  ROOT = '/',
  LOGIN = '/login',
  ALBUMS = '/albums',
  ALBUMS_NEW = 'new',
  ALBUMS_ID = ':id',
}

const App = () => {
  return (
    <>
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />

            <AppBar />

            <Routes>
              <Route path={ERoutes.ROOT} element={<Navigate to={ERoutes.LOGIN} replace />}></Route>
              <Route path={ERoutes.LOGIN} element={<Login />} />

              <Route path={ERoutes.ALBUMS} element={<ProtectedRoute element={Albums} />}>
                <Route path={ERoutes.ALBUMS_ID} element={<CurrentAlbum />} />

                <Route path={ERoutes.ALBUMS_NEW} element={<NewAlbum />} />
              </Route>

              <Route path={ERoutes.NOT_EXIST} element={<Navigate to={ERoutes.ROOT} replace />} />
            </Routes>
          </ThemeProvider>
        </HistoryRouter>
      </Provider>
    </>
  )
}

export default App

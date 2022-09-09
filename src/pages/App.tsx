import React, { FC } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material'

import { theme } from 'themes/palette'

import { AppBar } from 'components/AppBar'

import Login from 'pages/Login'
import Albums from 'pages/Albums'
import { GlobalStyles } from 'themes/global'

export enum ERoutes {
  NOT_EXIST = '*',
  ROOT = '/',
  LOGIN = '/login',
  ALBUMS = '/albums',
  ALBUMS_CREATE = '/albums/create',
  ALBUMS_ID = '/albums/:id',
}

const App: FC = () => {
  const isRestoreAuthPending = false
  const isLoggedIn = false

  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />

          <AppBar />

          <Box
            sx={{
              flex: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isRestoreAuthPending ? (
              <CircularProgress size={62} />
            ) : (
              <Routes>
                <Route path={ERoutes.ROOT} element={<Navigate to={ERoutes.LOGIN} replace />} />
                <Route
                  path={ERoutes.LOGIN}
                  element={!isLoggedIn ? <Login /> : <Navigate to={ERoutes.ALBUMS} replace />}
                />
                <Route
                  path={ERoutes.ALBUMS}
                  element={isLoggedIn ? <Albums /> : <Navigate to={ERoutes.ROOT} replace />}
                />
                <Route path={ERoutes.NOT_EXIST} element={<Navigate to={ERoutes.ROOT} replace />} />
              </Routes>
            )}
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App

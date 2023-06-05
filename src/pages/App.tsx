import { Provider } from 'react-redux'
import { HistoryRouter } from 'redux-first-history/rr6'
import { Container, CssBaseline, SxProps, Theme, ThemeProvider } from '@mui/material'
import { Slide, ToastContainer } from 'react-toastify'

import { theme } from 'themes/palette'
import { GlobalStyles } from 'themes/global'

import { store, history } from 'store'
import { restoreAuthAsync } from 'store/login/actions'

import { AppBar } from 'components/AppBar'
import AnimatedRoutes from 'containers/AnimatedRoutes'

import 'react-toastify/dist/ReactToastify.css'

export enum ERoutes {
  NOT_EXIST = '*',
  ROOT = '/',
  LOGIN = '/login',
  ALBUMS = '/albums',
  ALBUMS_NEW = 'new',
  ALBUMS_ID = ':id',
}

const containerStyles: SxProps<Theme> = {
  paddingTop: { xs: 2, md: 4 },
  paddingX: { xs: 2, md: 4 },
  marginTop: { xs: 0 },
  paddingBottom: { xs: 4 },
  flex: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  position: 'relative',
}

store.dispatch(restoreAuthAsync())

const App = () => {
  return (
    <>
      <Provider store={store}>
        <HistoryRouter history={history}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />

            <ToastContainer
              transition={Slide}
              position='top-center'
              hideProgressBar
              closeOnClick
              draggable
              autoClose={3000}
              progressStyle={undefined}
              limit={1}
            />

            <AppBar />

            <Container sx={{ ...containerStyles }}>
              <AnimatedRoutes />
            </Container>
          </ThemeProvider>
        </HistoryRouter>
      </Provider>
    </>
  )
}

export default App

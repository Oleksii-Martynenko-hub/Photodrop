import { FC, useEffect } from 'react'
import { Navigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { APIStatus } from 'api/MainApi'

import { useInput } from '../components/hooks/useInput'
import useToggle from 'components/hooks/useToggle'

import { ERoutes } from './App'
import { loginAsync } from 'store/login/actions'
import { checkToken } from 'store/login/reducers'
import { selectIsLoggedIn, selectStatus } from 'store/login/selectors'

const Login: FC = () => {
  const dispatch = useDispatch()

  const isLoggedIn = useSelector(selectIsLoggedIn)
  const status = useSelector(selectStatus)

  const [login, setLogin] = useInput('')
  const [password, setPassword] = useInput('')
  const [isShowPassword, setShowPassword] = useToggle(false)

  useEffect(() => {
    dispatch(checkToken())
  }, [])

  const handleOnClickLogin = () => {
    if (login && password) {
      dispatch(loginAsync({ login, password }))
    }
  }

  return (
    <>
      {isLoggedIn && <Navigate to={ERoutes.ALBUMS} replace />}

      <Box
        sx={{
          flex: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {status === APIStatus.PENDING ? (
          <CircularProgress size={62} />
        ) : (
          <Container
            sx={{
              paddingTop: { xs: 2, md: 4 },
              paddingX: { xs: 2, md: 4 },
              marginTop: { xs: 0 },
              paddingBottom: { xs: 20 },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={true}>
                <Typography variant='h2' align='center' gutterBottom>
                  Login
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={true}>
                <Typography variant='h6'>Enter your name and password</Typography>
              </Grid>

              <Grid item xs={12} sm={4} md={true}>
                <TextField
                  placeholder='Login'
                  fullWidth
                  value={login}
                  onChange={setLogin}
                  InputProps={{
                    sx: {
                      backgroundColor: '#F4F4F4',
                      borderRadius: '10px',
                      height: '40px',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={true}>
                <FormControl fullWidth>
                  <OutlinedInput
                    placeholder='Password'
                    value={password}
                    onChange={setPassword}
                    type={isShowPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={setShowPassword}
                          onMouseDown={setShowPassword}
                          edge='end'
                        >
                          {isShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    sx={{
                      backgroundColor: '#F4F4F4',
                      borderRadius: '10px',
                      height: '40px',
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={true}>
                <Button
                  variant='contained'
                  fullWidth
                  sx={{ borderRadius: '50px', height: '50px' }}
                  onClick={handleOnClickLogin}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Container>
        )}
      </Box>
    </>
  )
}

export default Login

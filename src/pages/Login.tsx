import { FC, useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { APIStatus } from 'api/MainApi'

import useToggle from 'components/hooks/useToggle'
import { useInput } from '../components/hooks/useInput'
import { useDidMountEffect } from 'components/hooks/useDidMountEffect'

import { loginAsync } from 'store/login/actions'
import { checkToken } from 'store/login/reducers'
import {
  selectErrorMessage,
  selectIsLoggedIn,
  selectStatus,
  selectStatusCode,
} from 'store/login/selectors'

import { ERoutes } from 'pages/App'

const Login: FC = () => {
  const dispatch = useDispatch()

  const status = useSelector(selectStatus)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const statusCode = useSelector(selectStatusCode)
  const errorMessage = useSelector(selectErrorMessage)

  const [login, setLogin] = useInput('')
  const [password, setPassword] = useInput('')

  const [loginValidation, setLoginValidation] = useState({ isValid: true, message: '' })
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: '' })

  const [isShowPassword, setShowPassword] = useToggle(false)

  useEffect(() => {
    dispatch(checkToken())
  }, [])

  useEffect(() => {
    if (status === APIStatus.REJECTED) {
      if (errorMessage === 'User not found') {
        return setLoginValidation({ isValid: false, message: 'User with this login not found.' })
      }

      if (errorMessage === 'Wrong password') {
        return setPasswordValidation({ isValid: false, message: 'Password is incorrect.' })
      }

      setLoginValidation({ isValid: false, message: '' })
      setPasswordValidation({
        isValid: false,
        message: `Something went wrong, status code: ${statusCode}`,
      })
    }
  }, [status, errorMessage])

  useDidMountEffect(() => {
    handleValidation('login')
  }, [login])

  useDidMountEffect(() => {
    handleValidation('password')
  }, [password])

  const handleOnClickLogin = () => {
    if (!handleValidation()) return

    dispatch(loginAsync({ login, password }))

    clearValidation()
  }

  // to services
  const clearValidation = () => {
    setLoginValidation({ isValid: true, message: '' })
    setPasswordValidation({ isValid: true, message: '' })
  }

  // to services
  const handleValidation = (input?: 'login' | 'password') => {
    const loginMsg = 'Please enter a valid login.'
    const passMsg = 'Please enter a valid password.'

    if (input === 'login') {
      if (!login) setLoginValidation({ isValid: false, message: loginMsg })
      if (login) setLoginValidation({ isValid: true, message: '' })
      return
    }

    if (input === 'password') {
      if (!password) setPasswordValidation({ isValid: false, message: passMsg })
      if (password) setPasswordValidation({ isValid: true, message: '' })
      return
    }

    if (!login || !password) {
      if (!login) {
        setLoginValidation({ isValid: false, message: loginMsg })
      }

      if (!password) {
        setPasswordValidation({ isValid: false, message: passMsg })
      }
      return false
    }
    return true
  }

  return (
    <>
      {isLoggedIn && <Navigate to={ERoutes.ALBUMS} replace />}

      {status === APIStatus.PENDING ? (
        <CircularProgress size={62} />
      ) : (
        <Grid container justifyContent='center'>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            justifyContent='center'
            sx={{ flex: { xs: '0 1 400px', md: '0 0 600px' } }}
          >
            <Grid item xs={12} md={12}>
              <Typography variant='h2' align='center' gutterBottom>
                Login
              </Typography>
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography variant='h6' align='center'>
                Enter your name and password
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                placeholder='Login'
                required
                error={!loginValidation.isValid}
                helperText={!loginValidation.isValid && loginValidation.message}
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

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder='Password'
                  value={password}
                  onChange={setPassword}
                  type={isShowPassword ? 'text' : 'password'}
                  error={!passwordValidation.isValid}
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
                {!passwordValidation.isValid && passwordValidation.message && (
                  <FormHelperText error={!passwordValidation.isValid}>
                    {passwordValidation.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={10} md={8}>
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
        </Grid>
      )}
    </>
  )
}

export default Login

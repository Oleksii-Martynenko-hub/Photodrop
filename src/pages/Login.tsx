import React, { FC } from 'react'
import {
  Button,
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

import { useInput } from '../components/hooks/useInput'
import useToggle from 'components/hooks/useToggle'

const Login: FC = () => {
  const [login, setLogin] = useInput('')
  const [password, setPassword] = useInput('')
  const [isShowPassword, setShowPassword] = useToggle(false)

  return (
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
            color='primary'
            placeholder='Login'
            fullWidth
            value={login}
            onChange={(e) => setLogin(e.target.value)}
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
              color='primary'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <Button variant='contained' fullWidth sx={{ borderRadius: '50px', height: '50px' }}>
            Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login

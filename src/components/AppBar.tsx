import { AppBar as Bar, IconButton, Toolbar } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

import { useDispatch, useSelector } from 'react-redux'

import { logout } from 'store/login/reducers'
import { selectIsLoggedIn } from 'store/login/selectors'

import { Logo } from '../components/Logo'

export const AppBar = () => {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const handleOnClickLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <Bar color='default'>
        <Toolbar>
          <Logo />

          {isLoggedIn && (
            <IconButton onClick={handleOnClickLogout} sx={{ position: 'absolute', right: '10px' }}>
              <LogoutIcon color='primary' />
            </IconButton>
          )}
        </Toolbar>
      </Bar>

      <Toolbar />
    </>
  )
}

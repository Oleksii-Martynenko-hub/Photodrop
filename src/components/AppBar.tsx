import { AppBar as Bar, IconButton, SxProps, Theme, Toolbar } from '@mui/material'
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

  const headerStyles: SxProps<Theme> = { minHeight: { xs: '56px', md: '66px' } }

  return (
    <>
      <Bar color='default' sx={headerStyles}>
        <Toolbar sx={headerStyles}>
          <Logo />

          {isLoggedIn && (
            <IconButton onClick={handleOnClickLogout} sx={{ position: 'absolute', right: '10px' }}>
              <LogoutIcon color='primary' />
            </IconButton>
          )}
        </Toolbar>
      </Bar>

      <Toolbar sx={headerStyles} />
    </>
  )
}

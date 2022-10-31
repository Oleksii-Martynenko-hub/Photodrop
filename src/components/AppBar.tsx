import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
import { AppBar as Bar, IconButton, SxProps, Theme, Toolbar } from '@mui/material'
// import LogoutIcon from '@mui/icons-material/Logout'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'

// import { logoutAsync } from 'store/login/actions'
// import { selectIsLoggedIn } from 'store/login/selectors'

import useToggle from 'components/hooks/useToggle'

import { Logo } from 'components/Logo'
import HideOnScroll from 'components/HideOnScroll'

export const AppBar = () => {
  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // const isLoggedIn = useSelector(selectIsLoggedIn)
  const [isShowBackButton, setIsShowBackButton] = useToggle(false)

  useEffect(() => {
    setIsShowBackButton(location.pathname.split('/').filter((p) => !!p).length > 1)
  }, [location.pathname])

  // const handleOnClickLogout = () => {
  //   dispatch(logoutAsync())
  // }

  const headerStyles: SxProps<Theme> = { minHeight: { xs: '56px', md: '66px' } }

  const handleOnClickBack = () => navigate(-1)

  return (
    <>
      <HideOnScroll>
        <Bar color='default' sx={headerStyles}>
          <Toolbar sx={{ ...headerStyles, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
            {isShowBackButton && (
              <IconButton onClick={handleOnClickBack} sx={{ position: 'absolute', left: '10px' }}>
                <ArrowBackIosNewRoundedIcon sx={{ color: '#262626' }} />
              </IconButton>
            )}

            <Logo />
            {/* 
            {isLoggedIn && (
              <IconButton
                onClick={handleOnClickLogout}
                sx={{ position: 'absolute', right: '10px' }}
              >
                <LogoutIcon color='primary' />
              </IconButton>
            )} */}
          </Toolbar>
        </Bar>
      </HideOnScroll>

      <Toolbar sx={headerStyles} />
    </>
  )
}
// fa3541d0-4c10-4a44-a957-b49a3d52d683

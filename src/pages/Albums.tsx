import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Fab, Grid, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { motion } from 'framer-motion'

import { APIStatus } from 'api/MainApi'

import { getAlbumsAsync } from 'store/albums/actions'
import {
  selectAlbums,
  selectErrorMessage,
  selectStatus,
  selectStatusCode,
} from 'store/albums/selectors'
import { logoutAsync } from 'store/login/actions'

import useToggle from 'components/hooks/useToggle'

import { ERoutes } from 'pages/App'

const Albums: FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const albums = useSelector(selectAlbums)
  const status = useSelector(selectStatus)
  const errorMsg = useSelector(selectErrorMessage)
  const errorCode = useSelector(selectStatusCode)

  const [isShowOutlet, setIsShowOutlet] = useToggle(false)

  useEffect(() => {
    setIsShowOutlet(location.pathname.split('/').filter((p) => !!p).length > 1)
  }, [location.pathname])

  useEffect(() => {
    if (status === APIStatus.IDLE) {
      dispatch(getAlbumsAsync())
    }
    if (status === APIStatus.REJECTED) {
      if (errorCode === 401 || errorMsg === 'Not authorized') {
        dispatch(logoutAsync())
      }
    }
  }, [albums, status])

  return (
    <>
      <Grid container direction='column'>
        {isShowOutlet ? (
          <Outlet />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Grid container alignItems='start'>
              <Grid item xs>
                <Typography variant='h3' gutterBottom>
                  Albums
                </Typography>
              </Grid>

              <Link to={ERoutes.ALBUMS_NEW}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Fab color='primary' size='small' sx={{ borderRadius: '8px' }}>
                    <AddRoundedIcon sx={{ fontSize: '30px' }} />
                  </Fab>
                </motion.div>
              </Link>
              {albums.map(({ id, name }) => (
                <Link key={id} to={`${id}`}>
                  <Typography variant='h4'>{name}</Typography>
                </Link>
              ))}
            </Grid>
          </motion.div>
        )}
      </Grid>
    </>
  )
}

export default Albums

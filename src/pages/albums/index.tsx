import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Fab, Grid, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { motion } from 'framer-motion'

import { APIStatus } from 'api/MainApi'

import { getAlbumsAsync } from 'store/albums/actions'
import { selectAlbums, selectErrors, selectStatus } from 'store/albums/selectors'
import { logoutAsync } from 'store/login/actions'

import useToggle from 'components/hooks/useToggle'

import { ERoutes } from 'pages/App'
import AlbumItem from 'components/AlbumItem'
import AlbumItemSkeleton from 'components/AlbumItemSkeleton'
import EmptyAlbumList from 'components/EmptyAlbumList'

const Albums: FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const albums = useSelector(selectAlbums)
  const status = useSelector(selectStatus)
  const errors = useSelector(selectErrors)

  const [isShowOutlet, setIsShowOutlet] = useToggle(false)

  useEffect(() => {
    setIsShowOutlet(location.pathname.split('/').filter((p) => !!p).length > 1)
  }, [location.pathname])

  useEffect(() => {
    if (status === APIStatus.IDLE) {
      dispatch(getAlbumsAsync())
    }
    if (status === APIStatus.REJECTED) {
      if (errors.length) {
        errors.forEach((error) => {
          if (error.msg === 'Not authorized') dispatch(logoutAsync())
        })
      }
    }
  }, [albums, status])

  return (
    <>
      <Grid container direction='column'>
        {isShowOutlet ? (
          <Outlet />
        ) : (
          <motion.div
            style={{ maxWidth: '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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

              <Grid container spacing={2}>
                {status === APIStatus.PENDING ? (
                  [...Array(10)].map((_, i) => <AlbumItemSkeleton key={i} index={i} />)
                ) : albums.length ? (
                  albums.map(({ id, ...album }, i) => (
                    <AlbumItem key={id} album={{ id, ...album }} index={i} />
                  ))
                ) : (
                  <EmptyAlbumList />
                )}
              </Grid>
            </Grid>
          </motion.div>
        )}
      </Grid>
    </>
  )
}

export default Albums

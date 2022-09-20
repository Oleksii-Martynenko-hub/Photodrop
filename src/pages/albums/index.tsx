import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button, Fab, Grid, Paper, Skeleton, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import InboxIcon from '@mui/icons-material/Inbox'
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
import AlbumItem from 'components/AlbumItem'
import AlbumItemSkeleton from 'components/AlbumItemSkeleton'
import EmptyAlbumList from 'components/EmptyAlbumList'

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

              <Grid container spacing={2} direction='column'>
                {status === APIStatus.PENDING ? (
                  [1, 2, 3, 4, 5, 6, 7].map((i) => <AlbumItemSkeleton key={i} />)
                ) : !albums.length ? (
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

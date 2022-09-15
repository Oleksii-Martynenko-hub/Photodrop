import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Grid, Typography } from '@mui/material'

import { APIStatus } from 'api/MainApi'

import { setUserData } from 'store/user/reducers'
import { getAlbumsAsync } from 'store/albums/actions'
import { selectAlbums, selectStatus } from 'store/albums/selectors'

import useToggle from 'components/hooks/useToggle'

import { ERoutes } from 'pages/App'

const Albums: FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const albums = useSelector(selectAlbums)
  const status = useSelector(selectStatus)
  const [isShowOutlet, setIsShowOutlet] = useToggle(false)

  useEffect(() => {
    setIsShowOutlet(location.pathname.split('/').filter((p) => !!p).length > 1)
  }, [location.pathname])

  useEffect(() => {
    if (status === APIStatus.IDLE) {
      dispatch(setUserData())
      dispatch(getAlbumsAsync())
    }
  }, [albums, status])

  return (
    <>
      <Grid container direction='column'>
        {isShowOutlet ? (
          <Outlet />
        ) : (
          <>
            <Typography variant='h2'>Albums</Typography>

            {(albums.length
              ? albums
              : [
                  { id: 13, name: 'album13' },
                  { id: 14, name: 'album14' },
                  { id: 11, name: 'album11' },
                ]
            ).map(({ id, name }) => (
              <Link key={id} to={`${id}`}>
                <Typography variant='h4'>{name}</Typography>
              </Link>
            ))}

            <Link to={ERoutes.ALBUMS_NEW}>Create new</Link>
          </>
        )}
      </Grid>
    </>
  )
}

export default Albums

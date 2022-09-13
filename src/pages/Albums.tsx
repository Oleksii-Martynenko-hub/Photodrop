import React, { FC, useEffect } from 'react'
import { Container } from '@mui/material'
import { Link, Outlet, Route, Routes } from 'react-router-dom'
import { ERoutes } from './App'
import CurrentAlbum from './CurrentAlbum'
import NewAlbum from './NewAlbum'

import jwt from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { selectAlbums, selectStatus } from 'store/albums/selectors'
import { APIStatus } from 'api/MainApi'
import { getAlbumsAsync } from 'store/albums/actions'
import { setUserData } from 'store/user/reducers'

const Albums: FC = () => {
  const dispatch = useDispatch()

  const albums = useSelector(selectAlbums)
  const status = useSelector(selectStatus)

  useEffect(() => {
    if (status === APIStatus.IDLE) {
      dispatch(setUserData())
      dispatch(getAlbumsAsync())
    }
  }, [albums, status])

  return (
    <Container
      sx={{
        paddingTop: { xs: 2, md: 4 },
        paddingX: { xs: 2, md: 4 },
        marginTop: { xs: 0 },
        paddingBottom: { xs: 0 },
      }}
    >
      <h3>Albums</h3>

      {!!albums.length &&
        albums.map(({ id, name }) => (
          <Link key={id} to={`${id}`}>
            {name}
          </Link>
        ))}

      <Link to={ERoutes.ALBUMS_NEW}>Create new</Link>
      <Outlet />
    </Container>
  )
}

export default Albums

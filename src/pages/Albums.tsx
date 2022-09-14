import React, { FC, useEffect } from 'react'
import { Container, Typography } from '@mui/material'
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
    <>
      <h2>Albums</h2>

      {albums.map(({ id, name }) => (
        <Link key={id} to={`${id}`}>
          <Typography variant='h4'>{name}</Typography>
        </Link>
      ))}

      <Link to={ERoutes.ALBUMS_NEW}>Create new</Link>

      <Outlet />
    </>
  )
}

export default Albums

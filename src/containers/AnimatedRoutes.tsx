import { FC } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AnimatePresence } from 'framer-motion'

import ProtectedRoute from 'containers/ProtectedRoute'
import { ERoutes } from 'pages/App'
import Login from 'pages/login'
import Albums from 'pages/albums'
import CurrentAlbum from 'pages/albums/CurrentAlbum'
import NewAlbum from 'pages/albums/NewAlbum'

const AnimatedRoutes: FC = () => {
  return (
    <AnimatePresence>
      <Routes>
        <Route path={ERoutes.ROOT} element={<Navigate to={ERoutes.LOGIN} replace />} />

        <Route path={ERoutes.LOGIN} element={<Login />} />

        <Route path={ERoutes.ALBUMS} element={<ProtectedRoute element={Albums} />}>
          <Route path={ERoutes.ALBUMS_ID} element={<CurrentAlbum />} />

          <Route path={ERoutes.ALBUMS_NEW} element={<NewAlbum />} />
        </Route>

        <Route path={ERoutes.NOT_EXIST} element={<Navigate to={ERoutes.ROOT} replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default AnimatedRoutes

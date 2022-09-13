import React from 'react'
import { Navigate } from 'react-router'

import { ERoutes } from 'pages/App'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from 'store/login/selectors'

interface Props {
  element: React.FC
}

const ProtectedRoute: React.FC<Props> = ({ element: Element }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)

  return <>{isLoggedIn ? <Element /> : <Navigate to={ERoutes.ROOT} replace />}</>
}

export default ProtectedRoute

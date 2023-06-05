import React from 'react'
import { Navigate } from 'react-router'
import { useSelector } from 'react-redux'

import { ERoutes } from 'pages/App'
import { selectIsLoggedIn, selectStatus } from 'store/login/selectors'
import { APIStatus } from 'api/MainApi'
import { FullPageLoader } from 'components/FullPageLoader'

interface Props {
  element: React.FC
}

const ProtectedRoute: React.FC<Props> = ({ element: Element }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const statusLogin = useSelector(selectStatus)

  if (statusLogin === APIStatus.PENDING) return <FullPageLoader />

  return <>{isLoggedIn ? <Element /> : <Navigate to={ERoutes.LOGIN} replace />}</>
}

export default ProtectedRoute

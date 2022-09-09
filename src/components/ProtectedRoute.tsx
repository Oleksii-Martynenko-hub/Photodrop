import React from 'react'
import { Navigate, RouteProps } from 'react-router'
import { Route } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

import { ERoutes } from 'pages/App'

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const isRestoreAuthPending = false
  const isLoggedIn = true

  if (isRestoreAuthPending)
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    )

  return isLoggedIn ? <Route {...props} /> : <Navigate to={ERoutes.ROOT} replace />
}

export default ProtectedRoute

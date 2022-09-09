import React from 'react'
import { AppBar as Bar, Toolbar } from '@mui/material'
import { Logo } from '../components/Logo'

export const AppBar = () => {
  return (
    <>
      <Bar color='default'>
        <Toolbar>
          <Logo />
        </Toolbar>
      </Bar>

      <Toolbar />
    </>
  )
}

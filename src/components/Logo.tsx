import React from 'react'
import { Link } from '@mui/material'
import styled from 'styled-components'

import { useMediaQuery } from './hooks/useMediaQuery'

export const Logo = () => {
  const logoSize = useMediaQuery.min(999) ? 'lg' : 'sm'

  return (
    <LinkStyled href='/' underline='none'>
      <LogoImage src={`logo-${logoSize}.png`} alt='logo' />
    </LinkStyled>
  )
}

const LinkStyled = styled(Link)`
  margin: auto;
  display: flex;
  align-items: center;
`

const LogoImage = styled.img`
  display: block;
`

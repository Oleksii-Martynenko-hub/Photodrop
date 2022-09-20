import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { useMediaQuery } from './hooks/useMediaQuery'

import { ERoutes } from 'pages/App'

export const Logo = () => {
  const logoSize = useMediaQuery.min(900) ? 'lg' : 'sm'

  return (
    <LinkStyled to={ERoutes.ROOT}>
      <LogoImage src={`/logo-${logoSize}.png`} alt='logo' />
    </LinkStyled>
  )
}

const LinkStyled = styled(Link)`
  margin: auto;
  display: flex;
  align-items: center;
  text-decoration: none;
`

const LogoImage = styled.img`
  display: block;
`

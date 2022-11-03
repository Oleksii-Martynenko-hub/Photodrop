import { Link } from 'react-router-dom'
import styled from 'styled-components'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'

import { useMediaQuery } from './hooks/useMediaQuery'

import { ERoutes } from 'pages/App'

export const Logo = () => {
  const logoSize = useMediaQuery.min(900) ? 'lg' : 'sm'

  return (
    <LinkStyled to={ERoutes.ROOT}>
      <PhotoCameraRoundedIcon sx={{ fontSize: '25px', color: '#3300cc', mr: '5px' }} />
      <LogoImage src={`/logo-${logoSize}.svg`} alt='logo' />
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

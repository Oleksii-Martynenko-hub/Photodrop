import { FC, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Paper, Skeleton, SxProps, Theme, Typography } from '@mui/material'
import moment from 'moment'

import { logoutAsync } from 'store/login/actions'
import { selectIsLoggedIn } from 'store/login/selectors'

import useToggle from 'components/hooks/useToggle'

import { AlbumData } from 'api/ProtectedApi'
import styled from 'styled-components'
import { motion } from 'framer-motion'

interface Props {
  album: AlbumData
  index: number
}

const AlbumItem: FC<Props> = ({ album, index }) => {
  const { id, name, location: albumLocation, date } = album

  const [formattedDate] = useState(moment(date).format('DD.MM.YYYY HH:mm'))

  return (
    <Grid item xs={12} md={6}>
      <motion.div
        // style={{ maxWidth: '100%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Paper variant='elevation' sx={{ padding: '8px', display: 'flex' }}>
          <LinkStyled to={`${id}`}>
            <Grid container spacing={1} wrap='nowrap'>
              <Grid item>
                <Icon src={`http://placeimg.com/8${index}/6${index}/any`} />
              </Grid>

              <Grid item sx={{ flex: 1, minWidth: 0 }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sx={{ minWidth: 0 }}>
                    <Name noWrap variant='h6'>
                      {name}
                    </Name>
                  </Grid>

                  <Grid item xs={12} sx={{ minWidth: 0 }}>
                    <Location noWrap variant='body1'>
                      {albumLocation}
                    </Location>
                  </Grid>

                  <Grid item xs={12} sx={{ minWidth: 0 }}>
                    <Date variant='caption'>{formattedDate}</Date>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </LinkStyled>
        </Paper>
      </motion.div>
    </Grid>
  )
}

export default AlbumItem

const LinkStyled = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
`

const Icon = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
`
const Name = styled(Typography)`
  color: #090909;
  line-height: 1.1;
  font-weight: 600;
  font-size: 17px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Location = styled(Typography)`
  color: #141414;
  line-height: 1.2;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Date = styled(Typography)`
  color: #444444;
  line-height: 1;
  font-size: 11px;
  margin-bottom: -5px;
  display: block;
  text-align: right;
`

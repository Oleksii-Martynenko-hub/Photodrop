import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Paper, Typography } from '@mui/material'
import moment from 'moment'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import { AlbumData } from 'api/ProtectedApi'
import { Image } from 'components/Image'

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: index * 0.05 } }}
        exit={{ opacity: 0 }}
      >
        <Paper variant='elevation' sx={{ padding: '8px', display: 'flex' }}>
          <LinkStyled to={`${id}`}>
            <Grid container spacing={1} wrap='nowrap'>
              <Grid item>
                <Image
                  width={80}
                  height={60}
                  src={`http://placeimg.com/8${index}/6${index}/any`}
                  // defaultImage='/favicon-32x32.png'
                />
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

import { FC } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import { ERoutes } from 'pages/App'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const EmptyAlbumList: FC = () => {
  return (
    <Grid item xs={12}>
      <motion.div
        // style={{ maxWidth: '100%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Grid container alignItems='center' direction='column' sx={{ py: 5 }}>
          <Grid item>
            <InboxIcon color='disabled' sx={{ fontSize: '34px' }} />
          </Grid>

          <Grid item>
            <Typography variant='h5' sx={{ mb: 3 }}>
              There is no albums yet.
            </Typography>
          </Grid>

          <Grid item>
            <LinkStyled to={ERoutes.ALBUMS_NEW}>
              <Button variant='contained' sx={{ borderRadius: '40px', height: '40px', px: 5 }}>
                Create one
              </Button>
            </LinkStyled>
          </Grid>
        </Grid>
      </motion.div>
    </Grid>
  )
}

export default EmptyAlbumList

const LinkStyled = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  border-radius: 40px;
`

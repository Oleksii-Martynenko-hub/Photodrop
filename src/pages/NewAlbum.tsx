import React, { FC } from 'react'
import { Container } from '@mui/material'

const NewAlbum: FC = () => {
  return (
    <Container
      sx={{
        paddingTop: { xs: 2, md: 4 },
        paddingX: { xs: 2, md: 4 },
        marginTop: { xs: 0 },
        paddingBottom: { xs: 0 },
      }}
    >
      Create new album
    </Container>
  )
}

export default NewAlbum

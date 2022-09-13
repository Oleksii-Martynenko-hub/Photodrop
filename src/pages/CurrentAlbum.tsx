import { FC } from 'react'
import { Container } from '@mui/material'
import { useParams } from 'react-router'

const CurrentAlbum: FC = () => {
  const params = useParams()
  console.log('🚀 ~ params', params)

  return (
    <Container
      sx={{
        paddingTop: { xs: 2, md: 4 },
        paddingX: { xs: 2, md: 4 },
        marginTop: { xs: 0 },
        paddingBottom: { xs: 0 },
      }}
    >
      CurrentAlbum
    </Container>
  )
}

export default CurrentAlbum

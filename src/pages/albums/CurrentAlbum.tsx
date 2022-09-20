import { FC } from 'react'
import { useParams } from 'react-router'
import { Container } from '@mui/material'
import { motion } from 'framer-motion'

const CurrentAlbum: FC = () => {
  const params = useParams<{ id: string }>()
  console.log('🚀 ~ params', params)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      CurrentAlbum {params.id}
    </motion.div>
  )
}

export default CurrentAlbum

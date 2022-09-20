import { FC, useState } from 'react'
import styled from 'styled-components'

import { motion } from 'framer-motion'
import { Box, Skeleton } from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'

import useToggle from 'components/hooks/useToggle'

interface Props {
  src: string
  defaultImage?: string
  width?: number | string
  height?: number | string
}

export const Image: FC<Props> = ({ src, defaultImage, width, height }) => {
  const [initAnimation] = useState({ opacity: 0, scale: 0.9 })
  const [isOriginalLoaded, setIsOriginalLoaded] = useToggle(false)

  return (
    <>
      <motion.div
        initial={initAnimation}
        animate={isOriginalLoaded ? 'loaded' : 'unload'}
        exit={initAnimation}
        variants={{
          unload: initAnimation,
          loaded: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3 },
          },
        }}
      >
        <ImageStyled
          src={src}
          onLoad={() => setIsOriginalLoaded(true)}
          isHide={!isOriginalLoaded}
          width={width}
          height={height}
        />
      </motion.div>

      {defaultImage ? (
        <ImageStyled src={defaultImage} isHide={isOriginalLoaded} width={width} height={height} />
      ) : (
        <Box
          sx={{
            display: isOriginalLoaded ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton variant='rounded' width={width} height={height} sx={{ bgcolor: '#eee' }} />
          <PhotoCameraRoundedIcon sx={{ color: '#ddd', fontSize: '36px', position: 'absolute' }} />
        </Box>
      )}
    </>
  )
}

const ImageStyled = styled.img<{
  width?: number | string
  height?: number | string
  isHide: boolean
}>`
  display: ${({ isHide }) => (isHide ? 'none' : 'block')};
  width: ${({ width }) => {
    return width !== undefined ? (typeof width === 'string' ? width : `${width}px`) : '100%'
  }};
  height: ${({ height }) => {
    return height !== undefined ? (typeof height === 'string' ? height : `${height}px`) : 'auto'
  }};
  object-fit: cover;
  border-radius: 4px;
`

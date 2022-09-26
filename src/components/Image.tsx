import { FC, ImgHTMLAttributes, ReactNode, useState } from 'react'
import styled from 'styled-components'

import { motion } from 'framer-motion'
import { Box, Skeleton } from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import NoPhotographyRoundedIcon from '@mui/icons-material/NoPhotographyRounded'

import useToggle from 'components/hooks/useToggle'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  defaultImage?: string
  width?: number | string
  height?: number | string
}

export const Image: FC<Props> = ({ src, defaultImage, width, height, ...props }: Props) => {
  const [initAnimation] = useState({ opacity: 0, scale: 0.9 })
  const [isOriginalLoaded, setIsOriginalLoaded] = useToggle(false)
  const [isRejected, setIsRejected] = useToggle(false)

  const onLoad = () => {
    setIsOriginalLoaded(true)
  }

  const onError = () => {
    setIsRejected(true)
  }

  return (
    <div>
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
          onLoad={onLoad}
          onError={onError}
          isHide={!isOriginalLoaded}
          width={width}
          height={height}
          {...props}
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
          <Skeleton
            variant='rounded'
            width={width || '100%'}
            height={height || '240px'}
            sx={{ bgcolor: '#eee' }}
            animation={isRejected ? false : 'wave'}
          />
          <motion.div
            animate={isRejected ? 'rejected' : 'loading'}
            variants={{
              loading: {
                scale: [0.95, 1.1, 0.95],
                transition: {
                  repeat: Infinity,
                  repeatDelay: 0.8,
                },
              },
              rejected: {
                scale: 1,
                transition: { duration: 0.2 },
              },
            }}
            style={{ position: 'absolute', zIndex: 2 }}
          >
            {isRejected ? (
              <NoPhotographyRoundedIcon sx={{ color: '#dcd2d2', fontSize: '36px' }} />
            ) : (
              <PhotoCameraRoundedIcon sx={{ color: '#ddd', fontSize: '36px' }} />
            )}
          </motion.div>
        </Box>
      )}
    </div>
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

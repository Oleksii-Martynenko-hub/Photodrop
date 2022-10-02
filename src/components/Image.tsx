import { FC, ImgHTMLAttributes, useState } from 'react'
import styled from 'styled-components'

import { motion } from 'framer-motion'
import { Box, Skeleton, SxProps, Theme } from '@mui/material'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import NoPhotographyRoundedIcon from '@mui/icons-material/NoPhotographyRounded'

import useToggle from 'components/hooks/useToggle'

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  defaultImage?: string
  width?: number | string
  height?: number | string
  iconSize?: number | string
  sx?: SxProps<Theme> | undefined
  clickable?: boolean
  onLoad?: () => void
}

export const Image: FC<Props> = ({
  src,
  defaultImage,
  width,
  height,
  iconSize,
  sx,
  clickable,
  onLoad,
  ...props
}: Props) => {
  const [initAnimation] = useState({ opacity: 0, scale: 0.9 })
  const [iconFontSize] = useState(
    iconSize ? (typeof iconSize === 'number' ? iconSize + 'px' : iconSize) : '26px',
  )
  const [isOriginalLoaded, setIsOriginalLoaded] = useToggle(false)
  const [isRejected, setIsRejected] = useToggle(false)

  const onLoadImage = () => {
    setIsOriginalLoaded(true)
    if (onLoad) onLoad()
  }

  const onError = () => {
    setIsRejected(true)
  }

  return (
    <Box sx={{ ...sx, borderRadius: '4px' }}>
      <motion.div
        initial={initAnimation}
        animate={isOriginalLoaded ? 'loaded' : 'unload'}
        exit={initAnimation}
        variants={{
          unload: initAnimation,
          loaded: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.2 },
          },
        }}
      >
        <ImageStyled
          src={src}
          onLoad={onLoadImage}
          onError={onError}
          isHide={!isOriginalLoaded}
          width={width}
          height={height}
          {...props}
        />
        {clickable && <Overlay isHide={!isOriginalLoaded} width={width} height={height} />}
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
            animation={false}
          />
          <motion.div
            animate={isRejected ? 'rejected' : 'loading'}
            variants={{
              loading: {
                color: ['#dddddd', '#3300cc', '#dddddd'],
                opacity: [1, 0.3, 1],
                scale: [0.9, 1.2, 0.9],
                transition: {
                  repeat: Infinity,
                  repeatDelay: 0.8,
                },
              },
              rejected: {
                scale: 1,
                opacity: 1,
                transition: { duration: 0.2 },
              },
            }}
            style={{ position: 'absolute', zIndex: 2 }}
          >
            {isRejected ? (
              <NoPhotographyRoundedIcon
                sx={{
                  color: '#dcd2d2',
                  fontSize: iconFontSize,
                  transform: 'translateY(3px)',
                }}
              />
            ) : (
              <PhotoCameraRoundedIcon
                sx={{
                  fontSize: iconFontSize,
                  transform: 'translateY(3px)',
                }}
              />
            )}
          </motion.div>
        </Box>
      )}
    </Box>
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

const Overlay = styled.div<{
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
  border-radius: 4px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 0 0 5px 5px rgb(255, 255, 255, 0);
  transition: background-color 0.3s, box-shadow 0.3s;

  :hover {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: inset -1px -2px 10px 3px rgb(255, 255, 255, 0.4);
  }
`

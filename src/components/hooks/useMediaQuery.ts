import { useMediaQuery as useMedia } from '@mui/material'

export const useMediaQuery = {
  min: (pixels: number) => useMedia(`(min-width:${pixels}px)`),
  max: (pixels: number) => useMedia(`(max-width:${pixels}px)`),
}

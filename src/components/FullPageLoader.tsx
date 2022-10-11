import styled from 'styled-components'
import { Dialog } from '@mui/material'

export const FullPageLoader = () => {
  return (
    <Dialog
      open
      sx={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
      PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      hideBackdrop
    >
      <FullPageLoaderStyled>
        <LoaderText>Almost there...</LoaderText>
      </FullPageLoaderStyled>
    </Dialog>
  )
}

const FullPageLoaderStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoaderText = styled.span`
  display: block;
`

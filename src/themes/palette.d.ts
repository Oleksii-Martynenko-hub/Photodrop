declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      custom: {
        light: string
        main: string
        dark: string
        contrastText: string
      }
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    palette: {
      custom: {
        light: string
        main: string
        dark: string
        contrastText: string
      }
    }
  }
}

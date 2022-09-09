import CracoAlias from 'craco-alias'
// import { resolve } from 'path'

export const plugins = [
  {
    plugin: CracoAlias,
    options: {
      source: 'tsconfig',
      /* tsConfigPath should point to the file where "paths" are specified */
      tsConfigPath: './tsconfig.paths.json',
    },
  },
]
export const webpack = {
  alias: {
    '@mui/styled-engine': '@mui/styled-engine-sc',
    // '@': resolve(__dirname, 'src/'),
  },
}

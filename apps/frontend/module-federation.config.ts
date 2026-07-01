import { createModuleFederationConfig } from '@module-federation/vite'

export default createModuleFederationConfig({
  name: 'product_publishing_frontend',
  filename: 'remoteEntry.js',
  manifest: true,
  dts: false,
  dev: {
    remoteHmr: true,
  },
  exposes: {
    './App': './src/App.tsx',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: '^19.2.7',
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^19.2.7',
    },
    'react-dom/client': {
      singleton: true,
      requiredVersion: '^19.2.7',
    },
  },
})

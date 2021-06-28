import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import'
import { envConfig } from './src/config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // vite preview模式下mode无法修改，因此需要用dev兜底
  const { apiHost, baseUrl } = envConfig[mode] || envConfig.dev
  return {
    base: baseUrl,
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: { '@primary-color': '#0065FE' },
          additionalData: [`@import '@/assets/styles/variable.less';`],
        },
      },
    },
    plugins: [
      styleImport({
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: (name) => {
              return `antd/es/${name}/style/index`
            },
          },
        ],
      }),
      reactRefresh(),
    ],
    server: {
      https: false,
      proxy: {
        [`${baseUrl}graphql`]: {
          target: apiHost,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})

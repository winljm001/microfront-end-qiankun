import React from 'react'
import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ApolloProvider } from '@apollo/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import gqlClient from '@/graphql/client'
import Router from './router'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
})

function App() {
  return (
    <div className="App">
      <ApolloProvider client={gqlClient}>
        <QueryClientProvider client={client}>
          <ConfigProvider locale={zhCN}>
            <Router />
          </ConfigProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ApolloProvider>
    </div>
  )
}

export default App

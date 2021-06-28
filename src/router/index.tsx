import React from 'react'
import { Router } from 'react-router'
import { renderRoutes } from 'react-router-config'
import { createBrowserHistory } from 'history'
import config from '@/config'
import routes from './config'

export const history = createBrowserHistory({
  basename: config.baseUrl,
})

const AppRouter = () => {
  return <Router history={history}>{renderRoutes(routes)}</Router>
}

export default AppRouter

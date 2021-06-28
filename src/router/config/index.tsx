import React from 'react'
import loadable from '@loadable/component'
import { Redirect } from 'react-router-dom'
import { BASE_PATH, LOGIN_PATH } from './path'
import { CustomRouteConfig } from './types.td'

const subModules = import.meta.globEager('./**/index.{ts,tsx}')
// 各个模块路由集合
let subModulesRoutes: CustomRouteConfig[] = []
// eslint-disable-next-line guard-for-in
for (const subModule in subModules) {
  subModulesRoutes.push(...subModules[subModule].default)
}

export const mainRoutes: CustomRouteConfig[] = [...subModulesRoutes]
const routes: CustomRouteConfig[] = [
  // 根路由
  {
    path: '/',
    exact: true,
    component: () => <Redirect to={BASE_PATH} />,
  },
  // 登录
  {
    path: LOGIN_PATH,
    exact: true,
    component: loadable(() => import('@/pages/login')),
  },
  // 主页面
  {
    path: BASE_PATH,
    component: loadable(() => import('@/layouts/main')),
    routes: mainRoutes,
  },
  // 未匹配到的路由渲染内容
  {
    path: '*',
    component: loadable(() => import('@/pages/404')),
  },
]
export default routes

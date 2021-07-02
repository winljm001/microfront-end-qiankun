import loadable from '@loadable/component'
import { LOGIN_PATH } from './path'
import { CustomRouteConfig } from './types.td'

const routes: CustomRouteConfig[] = [
  // // 根路由
  // {
  //   path: '/',
  //   exact: true,
  //   component: loadable(() => import('@/pages/login')),
  // },
  // 登录
  {
    path: LOGIN_PATH,
    exact: true,
    component: loadable(() => import('@/pages/login')),
  },
  // 主页面
  // {
  //   path: BASE_PATH,
  //   component: loadable(() => import('@/layouts/main')),
  //   routes: mainRoutes,
  // },
  // 未匹配到的路由渲染内容
  {
    path: '*',
    component: loadable(() => import('@/pages/404')),
  },
]
export default routes

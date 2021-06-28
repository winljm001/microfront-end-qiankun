import { matchPath } from 'react-router-dom'
import allRoutes from '@/router/config'
import { CustomRouteConfig } from '@/router/config/types.td'

/**
 * 根据路由配置生成菜单配置
 * @param routeConfig 路由配置
 */
export const getMenuConfigByRoutes = (routeConfig: CustomRouteConfig[]): CustomRouteConfig[] => {
  return (
    routeConfig
      ?.filter(({ meta }) => {
        // 如果有配置menu
        return meta?.menu && Object.keys(meta.menu).length
      })
      .map((item) => ({
        ...item,
        // 递归处理
        routes: getMenuConfigByRoutes(item.routes || []),
      })) || []
  )
}

/**
 * 从菜单中获取默认首页路由（第一个可选菜单项目）
 * @param menuList 菜单列表
 */
export const getHomepageUrl = (menuList: CustomRouteConfig[]) => {
  let menu: CustomRouteConfig | undefined = menuList.find((item) => {
    if (item.routes?.length) {
      return getHomepageUrl(item.routes)
    }
    return item.meta?.menu
  })
  while (menu?.routes?.length) {
    menu = menu.routes[0]
  }
  return menu?.path
}
/**
 * 根据pathname匹配路由和菜单
 * @param pathname location.pathname
 * @returns 获取当前路由及菜单信息
 */
export const getCurrentRouteAndMenuInfo = (
  pathname: string,
): [CustomRouteConfig | null, CustomRouteConfig | null, string[]] => {
  let currentRoute: CustomRouteConfig | null = null
  let currentMenu: CustomRouteConfig | null = null
  let openKeys: string[] = []
  const traverse = (menu: CustomRouteConfig[]) => {
    for (let i = 0; i <= menu?.length - 1; i++) {
      const route = menu[i]
      // exact需要为true
      const matchedRoute = matchPath(pathname, { ...route, exact: true })
      if (matchedRoute) {
        currentRoute = route
        if (route.meta?.menu) {
          currentMenu = route
        }
        return true
      } else {
        if (route.routes?.length) {
          const subResult = traverse(route.routes)
          // 如果子路由被匹配到
          if (subResult) {
            // 如果已获取到当前菜单项则将父菜单的menuText存储到openKeys
            const title = route.meta?.menu?.title
            if (currentMenu) {
              title && openKeys.push(route.path)
            }
            // 如果尚未获取到当前菜单项，则判断当前路由是否有menuText，若有则将route设置为当前菜单项
            if (!currentMenu) {
              title && (currentMenu = route)
            }
            return true
          }
        }
      }
    }
    return false
  }
  traverse(allRoutes)
  return [currentRoute, currentMenu, openKeys]
}

import React, { memo, useCallback, useMemo } from 'react'
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config'
import { Layout } from 'antd'
import { Redirect, useLocation } from 'react-router-dom'
import { BASE_PATH } from '@/router/config/path'
import { getCurrentRouteAndMenuInfo, getHomepageUrl } from '@/utils/route'
import useGlobalStore from '@/stores/global'
import auth from '@/components/hoc/auth'
import AppHeader from './components/header'
import AppBreadcrumb from './components/breadcrubm'
import SideMenu from './components/side-menu'
import styles from './style.module.less'
const { Header, Content, Sider } = Layout

const MainLayout: React.FC<RouteConfigComponentProps> = memo((props) => {
  const { route } = props
  const { menuConfig, userSetting, setUserSetting, userInfo, logout } = useGlobalStore()
  console.log(menuConfig)
  const location = useLocation()
  // 根据pathname获取当前匹配到的路由配置、菜单配置、菜单展开的key
  const [matchedRouteConfig, matchedMenuConfig, matchedOpenKeys] = useMemo(() => {
    return getCurrentRouteAndMenuInfo(location.pathname)
  }, [location.pathname])
  const setCollapsed = useCallback(
    (collapsed) => {
      setUserSetting({ collapsed })
    },
    [userSetting.collapsed],
  )
  if (matchedRouteConfig?.path === BASE_PATH) {
    return <Redirect to={getHomepageUrl(menuConfig)} />
  }
  return (
    <Layout className={styles.layout}>
      {/* 顶部header */}
      <Header className={styles.header}>
        <AppHeader
          sysName="星桥生产运营支撑平台"
          userInfo={userInfo}
          collapsed={userSetting.collapsed!}
          onCollapsedChange={setCollapsed}
          logout={logout}
        />
      </Header>
      <Layout>
        {/* 左侧菜单栏 */}
        <Sider collapsed={userSetting.collapsed!} trigger={null} collapsible width={208}>
          <SideMenu
            menuConfig={menuConfig}
            selectedKeys={[matchedMenuConfig!.path]}
            defaultOpenKeys={userSetting.collapsed ? [] : matchedOpenKeys}
            inlineCollapsed
          />
        </Sider>
        <Layout>
          {/* 面包屑 */}
          <AppBreadcrumb route={matchedRouteConfig!} />
          {/* 页面主体 */}
          <Content className={styles.content} id="frame">
            {renderRoutes(route?.routes)}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
})
export default auth(MainLayout)

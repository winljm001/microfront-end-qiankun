import React, { memo } from 'react'
import { Menu, MenuItemProps, MenuProps, SubMenuProps } from 'antd'
import { CustomRouteConfig } from '@/router/config/types.td'
import { history } from '@/router'
import styles from './style.module.less'

interface IProps extends MenuProps {
  menuConfig: CustomRouteConfig[]
}

const SideMenu: React.FC<IProps> = memo(({ menuConfig, ...restProps }) => {
  const handleLink = (path) => {
    history.push(path)
  }
  const renderMenu = (menuConfig: CustomRouteConfig[]) => {
    return menuConfig?.map((itemConfig) => {
      const menu = itemConfig.meta?.menu
      const subRoutes = itemConfig.routes || []
      if (subRoutes.length > 0) {
        return (
          <Menu.SubMenu key={itemConfig?.path} {...(menu as SubMenuProps)}>
            {/* recursive traversal */}
            {renderMenu(subRoutes)}
          </Menu.SubMenu>
        )
      }
      const { onClick, ...restProps } = menu as MenuItemProps
      return (
        <Menu.Item
          key={itemConfig?.path}
          {...restProps}
          onClick={(menuInfo) => {
            onClick ? onClick(menuInfo) : handleLink(itemConfig.path)
          }}>
          {menu?.title}
        </Menu.Item>
      )
    })
  }
  return (
    <Menu theme="dark" mode="inline" {...restProps} className={styles.sideMenu}>
      {renderMenu(menuConfig)}
    </Menu>
  )
})
export default memo(SideMenu)

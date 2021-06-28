import React, { FC } from 'react'
import { Menu, Dropdown } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { State } from '@/stores/global'
import header_logo from '@/images/header_logo.png'
import defaultAvatar from '@/images/avatar_default.png'
import { LOGIN_PATH } from '@/router/config/path'
import { history } from '@/router'
import styles from './index.module.less'

type IProps = Pick<State, 'logout' | 'userInfo'> & {
  sysName?: string
  collapsed?: boolean
  onCollapsedChange?: (collapse: boolean) => void
}

const AppHeader: FC<IProps> = ({ sysName, userInfo, logout, collapsed, onCollapsedChange }) => {
  const CollapseIcon = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
  const routeToLogin = () => {
    history.replace(LOGIN_PATH)
  }
  const menu = (
    <Menu>
      <Menu.Item
        key="logout"
        onClick={() => {
          logout(routeToLogin)
        }}>
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <img src={header_logo} />
        <div className={styles.name}>{sysName}</div>
        <CollapseIcon
          onClick={() => {
            onCollapsedChange?.(!collapsed)
          }}
          className={styles.collapseIcon}
        />
      </div>
      <div className={styles.right}>
        <span className={styles.corpName}>{userInfo?.orgName}</span>
        <Dropdown overlay={menu} trigger={['hover', 'click']}>
          <div className={styles.userInfo}>
            <img src={defaultAvatar} />
            <span className={styles.userName}>{userInfo?.username}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default AppHeader

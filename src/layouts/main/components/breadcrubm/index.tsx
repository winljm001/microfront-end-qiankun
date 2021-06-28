import React, { FC } from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { CustomRouteConfig } from '@/router/config/types.td'
import styles from './index.module.less'

interface IProps {
  route: CustomRouteConfig
}

const AppBreadcrumb: FC<IProps> = ({ route }) => {
  const breadcrumb = route.meta?.breadcrumb
  const { className, items, ...breadcrumbProps } = breadcrumb || {}
  // CustomBreadcrumbItem[]配置式
  if (!breadcrumb) {
    return null
  }
  return (
    <Breadcrumb className={classnames(className, styles.wrap)} {...breadcrumbProps}>
      {items
        ? items?.map((item, i) => {
            const { name, path, render, ...itemProps } = item
            return (
              <Breadcrumb.Item key={i} {...itemProps}>
                {render ? render(item, i) : path ? <Link to={path}>{name}</Link> : name}
              </Breadcrumb.Item>
            )
          })
        : null}
    </Breadcrumb>
  )
  // BreadcrumbProps配置式
}

export default AppBreadcrumb

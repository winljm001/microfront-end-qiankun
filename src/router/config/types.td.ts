import { RouteConfigComponentProps } from 'react-router-config'
import { MenuItemProps, SubMenuProps, BreadcrumbProps, BreadcrumbItemProps } from 'antd'
import React from 'react'
/**
 * @file 路由配置类型定义文件
 */

/**
 * 面包屑导航配置项
 */
export interface CustomBreadcrumbItem extends BreadcrumbItemProps {
  name?: string
  path?: string
  /** 渲染函数 */
  render?: (config: BreadcrumbItemProps, index: number) => React.ReactNode
}
/**
 * 面包屑导航配置
 */
export interface CustomBreadcrumb extends BreadcrumbProps {
  /** 面包屑导航项（比antd面包屑itemRender优先级低） */
  items?: CustomBreadcrumbItem[]
  className?: string
}
/**
 * 权限配置项
 */
export interface Auth<TAuth> {
  /** 是否开启校验 */
  enable: boolean
  /** 自定义校验规则 */
  validator: (authData: TAuth) => boolean
}
/**
 * 路由配置项
 */
export interface CustomRouteConfig<TAuth = any> {
  /** React key */
  key?: React.Key
  /** 渲染组件 */
  component: React.ComponentType<RouteConfigComponentProps<any>> | React.ComponentType
  /** 路径 */
  path: string
  /** 是否启用精准比较模式 */
  exact?: boolean
  /** 路径末尾的斜杠参是否参与比较 */
  strict?: boolean
  /** 页面信息配置 */
  meta?: {
    /** 面包屑配置 */
    breadcrumb?: CustomBreadcrumb
    /** 权限配置 */
    auth?: Auth<TAuth>
    /** 菜单配置 */
    menu?: MenuItemProps | SubMenuProps
  }
  /** 子路由 */
  routes?: CustomRouteConfig<TAuth>[]
}

import React from 'react'
import loadable from '@loadable/component'
import { SettingOutlined } from '@ant-design/icons'
import BlankLayout from '@/layouts/blank'
import { CustomRouteConfig } from '@/router/config/types.td'
import { BASE_URL, COMMODITY_MANAGEMENT, VARIETY_MANAGEMENT, COMMODITY_PLACE_MANAGEMENT } from './path'

const routes: CustomRouteConfig[] = [
  {
    path: BASE_URL,
    component: BlankLayout,
    meta: {
      menu: {
        title: '基础管理',
        icon: <SettingOutlined />,
      },
    },
    routes: [
      {
        path: COMMODITY_MANAGEMENT,
        meta: {
          menu: {
            title: '商品分类',
          },
          breadcrumb: {
            items: [{ name: '基础管理' }],
          },
        },
        component: loadable(() => import('@/pages/base-data/commodity-management/index')),
        routes: [
          {
            path: `${VARIETY_MANAGEMENT}/:id`,
            exact: true,
            meta: {
              breadcrumb: {
                items: [{ name: '基础管理', path: COMMODITY_MANAGEMENT }, { name: '商品分类' }],
              },
            },
            component: loadable(() => import('@/pages/base-data/commodity-management/variety-management/index')),
          },
        ],
      },
      {
        path: COMMODITY_PLACE_MANAGEMENT,
        component: loadable(() => import('@/pages/base-data/commodity-place-management')),
        meta: {
          menu: {
            title: '商品产地管理',
          },
          breadcrumb: {
            items: [{ name: '基础管理', path: BASE_URL }, { name: '商品产地管理' }],
          },
        },
      },
    ],
  },
]

export default routes

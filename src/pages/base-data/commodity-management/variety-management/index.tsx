import React, { FC, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Button, Popconfirm, Table, Tabs } from 'antd'
import { useMutation, useQuery } from '@apollo/client'
import BaseCard from '@/components/base-card'
import BaseDescriptions from '@/components/base-descriptions'
import ActionGroup from '@/components/action-group'
import { BooleanResult, Place, PlaceInput, Query, Variety } from '@/graphql/types'
import {
  getCategorDetail,
  requestDeleteCategoryPlace,
  requestDeleteCategoryVariety,
} from '@/graphql/gqls/baseData/commodityCategoryManagement'
import VarietyModal from './components/variety-modal'
import { ModalRef } from './components/refType'
import PlaceModal from './components/place-modal'
const { TabPane } = Tabs

interface SKUPageParams {
  id: string
}

const componentName: FC = () => {
  const params = useParams() as SKUPageParams
  const id = Number(params.id)
  const varietyModalRef = useRef<ModalRef>(null)
  const placeModalRef = useRef<ModalRef>(null)
  const [tabIndex, setTabIndex] = useState('1')
  const { data, refetch } = useQuery<{
    selectCategoryById: Query['selectCategoryById']
    selectVarietyByCategoryId: Variety[]
    selectPlaceByCategoryId: Place[]
  }>(getCategorDetail, {
    variables: {
      categoryId: id,
    },
  })
  // 删除产地
  const [delCategoryPlace] = useMutation<{ result: BooleanResult }, { placeInput: PlaceInput }>(
    requestDeleteCategoryPlace,
  )
  const delPlace = (placeId) => {
    delCategoryPlace({
      variables: {
        placeInput: {
          placeId,
          categoryId: id,
        },
      },
    }).then((r: any) => {
      if (r?.data?.deleteCategoryPlace) {
        refetch()
      }
    })
  }
  // 删除品种
  const [delCategoryVariety] = useMutation<{ result: BooleanResult }, { varietyId: number }>(
    requestDeleteCategoryVariety,
  )
  const delVariety = (varietyId) => {
    delCategoryVariety({
      variables: {
        varietyId: varietyId,
      },
    }).then((r: any) => {
      if (r?.data?.deleteCategoryVariety) {
        refetch()
      }
    })
  }
  const varietyColumns = [
    {
      title: '品种',
      dataIndex: 'varietyName',
    },
    {
      title: '操作',
      dataIndex: '_',
      render: (_, record) => {
        return (
          <ActionGroup
            actions={[
              {
                children: '编辑',
                onClick() {
                  varietyModalRef.current?.open?.(record)
                },
              },
              {
                children: (
                  <Popconfirm
                    title="确定删除品种?"
                    onConfirm={() => {
                      delVariety(record?.varietyId)
                    }}
                    okText="删除"
                    cancelText="取消">
                    <a href="#">删除</a>
                  </Popconfirm>
                ),
              },
            ]}
          />
        )
      },
    },
  ]
  const placeColumns = [
    {
      title: '产地',
      dataIndex: 'placeName',
    },
    {
      title: '操作',
      dataIndex: '_',
      render: (_, record) => {
        return (
          <ActionGroup
            actions={[
              {
                children: (
                  <Popconfirm
                    title="确定删除产地?"
                    onConfirm={() => {
                      delPlace(record?.placeId)
                    }}
                    okText="删除"
                    cancelText="取消">
                    <a href="#">删除</a>
                  </Popconfirm>
                ),
              },
            ]}
          />
        )
      },
    },
  ]
  // 点击新增打开新增模态框，根据当前打开tab决定新增品种还是产地
  const addHandle = () => {
    switch (tabIndex) {
      case '1':
        varietyModalRef.current?.open?.()
        break
      case '2':
        placeModalRef.current?.open?.()
        break
      default:
        break
    }
  }
  return (
    <div className="contentWrap">
      <BaseCard title="商品信息">
        <BaseDescriptions
          data={[
            {
              label: '商品类型',
              value: data?.selectCategoryById?.commodityTypeName,
            },
            {
              label: '商品分类',
              value: data?.selectCategoryById?.categoryName,
            },
          ]}
        />
      </BaseCard>
      <BaseCard bodyStyle={{ paddingTop: 0 }}>
        <Tabs
          size="large"
          onChange={(v) => {
            setTabIndex(v)
          }}
          activeKey={tabIndex}
          tabBarExtraContent={
            <Button type="primary" onClick={addHandle}>
              新增
            </Button>
          }>
          <TabPane tab="品种" key="1">
            <Table columns={varietyColumns} dataSource={data?.selectVarietyByCategoryId} rowKey="varietyId" />
          </TabPane>
          <TabPane tab="产地" key="2">
            <Table columns={placeColumns} dataSource={data?.selectPlaceByCategoryId} rowKey="placeId" />
          </TabPane>
        </Tabs>
      </BaseCard>
      <VarietyModal ref={varietyModalRef} categoryId={id} refetch={refetch} />
      <PlaceModal ref={placeModalRef} categoryId={id} refetch={refetch} />
    </div>
  )
}

export default componentName

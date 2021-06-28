import React, { FC, useCallback, useRef, useState } from 'react'
import { Button, Table, Space, TableColumnProps, message, Modal } from 'antd'
import { useHistory } from 'react-router-dom'
import { useUpdateEffect } from 'ahooks'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import withSubRoutes from '@/components/hoc/withSubRoutes'
import { VARIETY_MANAGEMENT } from '@/router/config/base-data/path'
import ActionGroup from '@/components/action-group'
import BaseCard from '@/components/base-card'
import {
  getCategoryCount,
  getCategoryList,
  getSelectCategoryById,
  requestDeleteCategory,
} from '@/graphql/gqls/baseData/commodityCategoryManagement'
import { Query, QueryCategoryListArgs, QuerySelectCategoryByIdArgs } from '@/graphql/types'
import Filter from './components/filter/index'
import EditModal from './components/edit-modal/index'
import { EditMode } from './components/edit-modal/components/new-or-edit-form'

interface IProps {}

const CommodityManagement: FC<IProps> = () => {
  const editMode = useRef<EditMode>(null)
  const [initialValues, setInitialValues] = useState<any>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [orderingDefaultValue, setOrderingDefaultValue] = useState<number>()
  const [pageCurrent, setPageCurrent] = useState<number>()
  const [pageSize, setPageSiz] = useState<number>(10)
  const history = useHistory()
  const apolloClient = useApolloClient()

  /* 获取数据总条数 */
  const { refetch: orderingRefetch } = useQuery(getCategoryCount)

  /* 获取table列表数据 */
  const {
    data: dataTable,
    loading,
    refetch,
  } = useQuery<{ categoryList: Query['categoryList'] }, QueryCategoryListArgs>(getCategoryList, {
    variables: {
      commodityTypeInput: {
        page: {
          pageCurrent: 1,
          pageSize: pageSize,
        },
      },
    },
  })

  /* 删除商品接口 */
  const [deleteDetailData] = useMutation(requestDeleteCategory)

  /* 跳转到管理品种页面 */
  const handleJump = useCallback((Id: number) => {
    history.push(`${VARIETY_MANAGEMENT}/${Id}`)
  }, [])

  /* Filter组件重置刷新列表 */
  const reset = () => {
    setLoadingModal(true)
    refetch({
      commodityTypeInput: {
        page: {
          pageCurrent: 1,
          pageSize: pageSize,
        },
      },
    }).then(() => {
      setPageCurrent(1)
      setPageSiz(10)
      setLoadingModal(false)
    })
  }

  /* Filter组件查询刷新列表 */
  const submit = (categoryName: string, commodityTypeId: number) => {
    setLoadingModal(true)
    refetch({
      commodityTypeInput: {
        page: {
          pageCurrent: 1,
          pageSize: pageSize,
        },
        commodityTypeId,
        categoryName,
      },
    }).then(() => {
      setLoadingModal(false)
      setPageCurrent(1)
    })
  }

  /* 点击编辑，打开模态框 */
  const handleEditModal = (mode: EditMode, id: number) => {
    editMode.current = mode
    /* 获取详情数据 */
    apolloClient
      .query<{ selectCategoryById: Query }, QuerySelectCategoryByIdArgs>({
        query: getSelectCategoryById,
        variables: {
          categoryId: id,
        },
      })
      .then((data) => {
        setInitialValues(data?.data.selectCategoryById)
        setShowEditModal(true)
      })
      .catch(() => {
        message.error('网络异常')
      })
  }

  /* 清空编辑or新增相关数据，当我传入initialValues或者options两种数据时如果不重新清空，则modal的destroyOnClose属性不起作用 */
  useUpdateEffect(() => {
    if (!showEditModal) {
      setInitialValues({})
      editMode.current = null
    }
  }, [showEditModal])

  /* 编辑or新增改动数据成功 */
  const onEditSuccess = () => {
    setLoadingModal(true)
    refetch({
      commodityTypeInput: {
        page: {
          pageCurrent: 1,
          pageSize: pageSize,
        },
      },
    }).then(() => {
      /* 当重新刷新列表loading状态 */
      setLoadingModal(false)
    })
  }

  /* table头部标题数据 */
  const columns: TableColumnProps<any>[] = [
    {
      title: '商品类型',
      dataIndex: 'commodityTypeName',
    },
    {
      title: '商品分类',
      dataIndex: 'categoryName',
    },
    {
      title: '排序',
      dataIndex: 'ordering',
    },
    {
      width: 600,
      title: '操作',
      dataIndex: '_',
      render(_, record) {
        /* 商品类型Id */
        let commodityTypeId = record.commodityTypeId
        /* 商品分类Id */
        let categoryId: number = record.categoryId
        return commodityTypeId === 1 ? (
          <ActionGroup
            actions={[
              {
                children: '编辑',
                onClick: () => {
                  handleEditModal('editMode', categoryId)
                },
              },
              {
                children: ' 管理品种/产地',
                onClick: () => {
                  handleJump(categoryId)
                },
              },
              {
                children: '删除',
                onClick: () => {
                  warning(categoryId)
                },
              },
            ]}
          />
        ) : (
          <ActionGroup
            actions={[
              {
                children: '编辑',
                onClick: () => {
                  handleEditModal('editMode', categoryId)
                },
              },
              {
                children: '删除',
                onClick: () => {
                  warning(categoryId)
                },
              },
            ]}
          />
        )
      },
    },
  ]

  /* 点击删除时弹窗，且判断你是否删除 */
  const warning = (Id) => {
    Modal.confirm({
      title: '是否确定删除',
      onOk: () => {
        sureToDelete(Id)
      },
    })
  }

  /* 确定删除时的回调 */
  const sureToDelete = (Id) => {
    deleteDetailData({
      variables: {
        categoryId: Id,
      },
    })
      .then(() => {
        message.success('删除成功')
        onEditSuccess()
      })
      .catch(() => {
        message.error('删除失败')
      })
  }

  return (
    <div style={{ padding: '20px' }}>
      <BaseCard>
        <Filter submit={submit} reset={reset} />
        <Space size={24}>
          <Button
            type="primary"
            ghost
            onClick={() => {
              /* 每次点击新增都去获取默认排序值 */
              orderingRefetch().then((res) => {
                /* 默认排序值 */
                setOrderingDefaultValue(res?.data?.categoryCount?.size + 1)
                setShowEditModal(true)
              })
            }}>
            新增分类
          </Button>
        </Space>
      </BaseCard>
      <BaseCard>
        <Table
          rowKey="categoryId"
          loading={loadingModal || loading}
          bordered
          dataSource={dataTable?.categoryList?.records || []}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            total: dataTable?.categoryList?.totalRecords,
            showTotal: (total) => `共 ${total} 记录`,
            current: pageCurrent,
            pageSize: pageSize,
            onChange(page, pageSize) {
              setPageCurrent(page)
              setPageSiz(pageSize as number)
              refetch({
                commodityTypeInput: {
                  page: {
                    pageCurrent: page,
                    pageSize,
                  },
                },
              })
            },
          }}
        />
      </BaseCard>
      <EditModal
        visible={showEditModal}
        setVisible={setShowEditModal}
        mode={editMode.current}
        initialValues={initialValues}
        onSuccess={onEditSuccess}
        ordering={orderingDefaultValue}
      />
    </div>
  )
}

export default withSubRoutes(CommodityManagement)

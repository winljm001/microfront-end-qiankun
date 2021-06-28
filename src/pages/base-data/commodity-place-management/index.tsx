import React, { FC, useCallback, useMemo, useRef } from 'react'
import { Button, Space, Tree, TreeDataNode, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@apollo/client'
import classnames from 'classnames'
import DataSuspense from '@/components/data-suspense'
import { PlaceInput, IntResult, Place, BooleanResult } from '@/graphql/types'
import { getPlaceTree, modifyPlaceTree, deletePlace } from '@/graphql/gqls/baseData/commodityPlaceManagement'
import buildTree, { TreeNodeData } from '@/utils/placeList2Tree'
import TreeNodeTitle from './components/tree-node-title'
import AddModal, { Ref as AddModalRef, DetailData as AddModalDetailData } from './components/add-modal'
import EditModal, { Ref as EditModalRef, DetailData as EditModalDetailData } from './components/edit-modal'
import styles from './index.module.less'

interface IProps {}

/**
 * 根据子key查找其在树中的父级name
 * @param treeData
 * @param key
 * @returns
 */
const findParentBySubKey = (treeData: TreeNodeData[], key: TreeNodeData['key']): TreeNodeData | null => {
  let parent: TreeNodeData | null = null
  for (let item of treeData) {
    if (item.children.some((subItem) => subItem.key === key)) {
      return item
    }
    if (item.children) {
      parent = findParentBySubKey(item.children, key)
      if (parent) {
        return parent
      }
    }
  }
  return parent
}
const CommodityPlaceManagement: FC<IProps> = () => {
  const addModalRef = useRef<AddModalRef>(null)
  const editModalRef = useRef<EditModalRef>(null)
  const { loading, error, data, refetch } = useQuery<{ selectPlaceTree: Place[] }>(getPlaceTree)
  const treeData = useMemo(() => {
    const sourceData = data?.selectPlaceTree || []
    buildTree(sourceData)
    return buildTree(sourceData)
  }, [data])
  const [placeMutation] = useMutation<{ modifyPlaceTree: IntResult }, { placeInput: PlaceInput }>(modifyPlaceTree)
  const [deletePlaceMutation] = useMutation<{ deletePlace: BooleanResult }, { placeId: number }>(deletePlace)
  /**
   * 请求后端添加产地
   */
  const requestToAdd = useCallback((values: AddModalDetailData) => {
    return placeMutation({
      variables: {
        placeInput: {
          placeName: values.placeName,
          placePid: values.placeId,
        },
      },
    })
      .then(() => {
        message.success('新增产地成功')
        refetch()
        return Promise.resolve(true)
      })
      .catch(() => {
        return Promise.resolve(false)
      })
  }, [])
  /**
   * 新增根节点
   */
  const handleRootAdd = useCallback(() => {
    addModalRef.current?.open!({
      detail: {
        placeId: 0,
        parentPlaceName: '顶级',
        placeName: '',
      },
      onSave: requestToAdd,
    })
  }, [])
  /**
   * 新增子节点
   */
  const handleSubAdd = useCallback((nodeData: TreeDataNode) => {
    addModalRef.current?.open!({
      detail: {
        placeId: +nodeData.key,
        parentPlaceName: nodeData.title!.toString(),
        placeName: '',
      },
      onSave: requestToAdd,
    })
  }, [])
  /**
   * 请求后端修改产地
   */
  const requestToEdit = useCallback(
    (values: EditModalDetailData) => {
      return placeMutation({
        variables: {
          placeInput: {
            placeName: values.placeName,
            placeId: values.placeId,
            placePid: findParentBySubKey(treeData, values.placeId)?.key || 0,
          },
        },
      })
        .then(() => {
          message.success('修改产地成功')
          refetch()
          return Promise.resolve(true)
        })
        .catch(() => {
          return Promise.resolve(false)
        })
    },
    [treeData],
  )
  /**
   * 编辑节点
   */
  const handleEdit = useCallback(
    (nodeData: TreeDataNode) => {
      const keyNum = +nodeData.key
      const title = findParentBySubKey(treeData, keyNum)?.title
      editModalRef.current?.open!({
        detail: {
          placeId: keyNum,
          parentPlaceName: title || '顶级',
          placeName: nodeData.title!.toString(),
        },
        onSave: requestToEdit,
      })
    },
    [treeData, requestToEdit],
  )
  /**
   * 请求后端删除某个产地
   * @param id 删除的产地id
   */
  const deletePlaceById = (id: number) => {
    return deletePlaceMutation({
      variables: {
        placeId: id,
      },
    })
      .then(() => {
        message.success('删除成功')
        refetch()
      })
      .catch(() => {})
  }
  /**
   * 删除节点事件
   */
  const handleDelete = useCallback((nodeData: TreeDataNode) => {
    if (nodeData.children?.length) {
      return message.warn('当前节点含有子节点，不能删除')
    }
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确认删除产地【${nodeData.title}】`,
      okText: '删除',
      onOk() {
        return deletePlaceById(+nodeData.key)
      },
    })
  }, [])
  /**
   * 自定义渲染节点title
   */
  const titleRender = useCallback(
    (nodeData: TreeDataNode) => {
      return <TreeNodeTitle nodeData={nodeData} onAdd={handleSubAdd} onEdit={handleEdit} onDelete={handleDelete} />
    },
    [handleSubAdd, handleEdit, handleDelete],
  )
  return (
    <div className={classnames(styles.wrap, { [styles.error]: error })}>
      <DataSuspense loading={loading} error={!!error}>
        <Space direction="vertical" size={24}>
          <Button type="primary" onClick={handleRootAdd}>
            新增产地
          </Button>
          <Tree selectable={false} treeData={treeData} titleRender={titleRender} showLine />
        </Space>
        <AddModal ref={addModalRef} />
        <EditModal ref={editModalRef} />
      </DataSuspense>
    </div>
  )
}

export default CommodityPlaceManagement

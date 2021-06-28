import React, { forwardRef, useImperativeHandle, useMemo } from 'react'
import { Modal, Space, Button, Form, TreeSelect } from 'antd'
import { useToggle } from 'ahooks'
import { useForm } from 'antd/lib/form/Form'
import { useMutation, useQuery } from '@apollo/client'
import { Place, PlaceInput } from '@/graphql/types'
import { getSelectPlaceTree, requestModifyCategoryPlace } from '@/graphql/gqls/baseData/commodityCategoryManagement'
import buildTree, { TreeNodeData } from '@/utils/placeList2Tree'
import { ModalRef } from '../refType'

const { TreeNode } = TreeSelect

interface IProps {
  categoryId?: number
  refetch?: () => void
}

const PlaceModal = forwardRef<ModalRef, IProps>((props, ref) => {
  const { categoryId, refetch } = props
  const [visible, { toggle }] = useToggle(false)
  const [formRef] = useForm()

  const { data: placeList } = useQuery<{
    selectPlaceTree: Place[]
  }>(getSelectPlaceTree)

  const placeTree = useMemo(() => {
    return placeList?.selectPlaceTree ? buildTree(placeList?.selectPlaceTree) : []
  }, [placeList])
  const [modifyCategoryPlace, { loading }] = useMutation<{ id: number }, { placeInput: PlaceInput }>(
    requestModifyCategoryPlace,
  )

  // 向外暴露方法
  useImperativeHandle(
    ref,
    () => ({
      open(obj) {
        formRef.resetFields()
        formRef.setFieldsValue(obj ? obj : {})
        toggle(true)
      },
      close() {
        toggle(false)
      },
    }),
    [],
  )
  // 新增修改
  const savePlace = (toggleModal = true) => {
    formRef.validateFields().then((res) => {
      modifyCategoryPlace({
        variables: {
          placeInput: { ...res, categoryId },
        },
      }).then(() => {
        formRef.resetFields()
        refetch?.()
        if (toggleModal) {
          toggle(false)
        }
      })
    })
  }
  const buildTreeNodeList = (list: TreeNodeData[]) => {
    return list?.map((v) => {
      return (
        <TreeNode value={v?.key} title={v?.title} key={v?.key}>
          {v?.children?.length > 0 ? buildTreeNodeList(v?.children) : null}
        </TreeNode>
      )
    })
  }
  return (
    <Modal
      visible={visible}
      width={520}
      title="新增产地"
      footer={
        <Space>
          <Button
            type="default"
            onClick={() => {
              toggle(false)
            }}>
            取消
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              savePlace()
            }}>
            保存并返回
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              savePlace(false)
            }}>
            保存并继续添加
          </Button>
        </Space>
      }
      onCancel={() => {
        toggle()
      }}
      destroyOnClose>
      <Form form={formRef} layout="vertical" name="basic">
        <Form.Item label="产地" name="placeId" rules={[{ required: true, message: '请选择产地!' }]}>
          <TreeSelect showSearch allowClear treeDefaultExpandAll placeholder="请选择产地">
            {buildTreeNodeList(placeTree)}
          </TreeSelect>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default PlaceModal

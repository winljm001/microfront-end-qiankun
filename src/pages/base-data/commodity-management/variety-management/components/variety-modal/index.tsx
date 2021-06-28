import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Space, Button, Form, Input } from 'antd'
import { useToggle } from 'ahooks'
import { useForm } from 'antd/lib/form/Form'
import { useMutation } from '@apollo/client'
import { VarietyInput } from '@/graphql/types'
import { requestModifyCategoryVariety } from '@/graphql/gqls/baseData/commodityCategoryManagement'
import { ModalRef } from '../refType'

interface IProps {
  categoryId?: number
  refetch?: () => void
}

const VarietyModal = forwardRef<ModalRef, IProps>((props, ref) => {
  const { categoryId, refetch } = props
  const [visible, { toggle }] = useToggle(false)
  const [state, setState] = useState<any>()
  const [formRef] = useForm()

  const [modifyCategoryVariety, { loading }] = useMutation<{ id: number }, { varietyInput: VarietyInput }>(
    requestModifyCategoryVariety,
  )

  // 向外暴露方法
  useImperativeHandle(
    ref,
    () => ({
      open(obj) {
        formRef.resetFields()
        setState(obj)
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
  const saveVariety = (toggleModal = true) => {
    formRef.validateFields().then((res) => {
      modifyCategoryVariety({
        variables: {
          varietyInput: { ...res, categoryId },
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

  return (
    <Modal
      visible={visible}
      width={520}
      title={state?.varietyId ? '编辑品种' : '新增品种'}
      footer={
        <Space>
          <Button
            type="default"
            onClick={() => {
              toggle(false)
            }}>
            取消
          </Button>
          {state?.varietyId ? (
            <Button
              type="primary"
              loading={loading}
              onClick={() => {
                saveVariety()
              }}>
              保存
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  saveVariety()
                }}>
                保存并返回
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  saveVariety(false)
                }}>
                保存并继续添加
              </Button>
            </>
          )}
        </Space>
      }
      onCancel={() => {
        toggle()
      }}
      destroyOnClose>
      <Form form={formRef} layout="vertical" name="basic">
        <Form.Item hidden name="varietyId" />
        <Form.Item
          label="品种"
          name="varietyName"
          rules={[
            { max: 10, message: '不能超过10个字' },
            { required: true, message: '请输入品种!' },
          ]}>
          <Input autoComplete="off" placeholder="请输入品种" />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default VarietyModal

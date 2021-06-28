import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, Space, Button } from 'antd'
import { useBoolean, useToggle } from 'ahooks'
import PlaceForm, { Ref as PlaceFormRef } from '../place-form'

export interface DetailData {
  /** 产地名称 */
  placeName: string
  /** 上级产地名称 */
  parentPlaceName: string
  /** 产地id */
  placeId: number
}
export interface OpenOptions {
  /** 详情数据 */
  detail: DetailData
  /**
   * 保存事件,Promise结果为true表示成功，为false表示失败
   * @param formData 回传的数据
   */
  onSave?: (formData: DetailData) => Promise<boolean>
}
export interface Ref {
  /** 打开弹框 */
  open?: (options: OpenOptions) => void
  /** 关闭弹框 */
  close?: () => void
}
interface IProps {}

const EditModal = forwardRef<Ref, IProps>((props, ref) => {
  const [visible, { toggle }] = useToggle(false)
  const [loading, { toggle: toggleLoading }] = useBoolean(false)
  const placeFormRef = useRef<PlaceFormRef>(null)
  const openOptionsRef = useRef<OpenOptions | null>(null)
  // 向外暴露方法
  useImperativeHandle(
    ref,
    () => ({
      open(options) {
        openOptionsRef.current = options
        toggle(true)
      },
      close() {
        toggle(false)
      },
    }),
    [],
  )
  return (
    <Modal
      visible={visible}
      width={520}
      title="修改产地"
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
              toggleLoading(true)
              const { detail, onSave } = openOptionsRef.current!
              placeFormRef.current!.form.validateFields().then((values) => {
                onSave?.({
                  ...detail,
                  placeName: values.placeName,
                }).then((result) => {
                  toggleLoading(false)
                  if (result) {
                    // 编辑成功关闭弹框
                    toggle(false)
                  }
                })
              })
            }}>
            保存
          </Button>
        </Space>
      }
      onCancel={() => {
        toggle()
      }}
      destroyOnClose>
      <PlaceForm ref={placeFormRef} initialValues={openOptionsRef.current?.detail} />
    </Modal>
  )
})

export default EditModal

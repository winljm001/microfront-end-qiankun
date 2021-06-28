import React, { FC, useRef, useState } from 'react'
import { Modal, Button, FormInstance, message } from 'antd'
import { useMutation } from '@apollo/client'
import { requestModifyCategory } from '@/graphql/gqls/baseData/commodityCategoryManagement'
import NewOrEditForm, { EditMode, InitialValues } from './components/new-or-edit-form'

interface IProps {
  /* 弹窗显示 */
  visible: boolean
  /* 设置弹窗显示 */
  setVisible: (value: boolean) => void
  /* 新增or编辑模式 */
  mode: EditMode
  /* 初始化值 DOTO:到时看看具体什么类型 */
  initialValues?: InitialValues
  /* 编辑or新增修改动数据成功回调 */
  onSuccess: () => void
  /* 默认排序  */
  ordering?: number
}

export type FormRef = {
  form: FormInstance
}

const EditModal: FC<IProps> = ({ visible, setVisible, mode, initialValues, onSuccess, ordering }) => {
  const formRef = useRef<FormRef>(null)
  const [btnLoading, setBtnLoading] = useState<boolean>(false)
  const titleText = useRef<string>()

  titleText.current = mode === 'editMode' ? '修改分类' : '新增分类'

  /* 编辑或者新增商品分类接口，不传Id则为新增，传入Id则是编辑 */
  const [saveOrEditSend] = useMutation(requestModifyCategory)

  /* 保存并返回 */
  const handleSaveBack = () => {
    formRef.current?.form
      .validateFields()
      .then((data) => {
        const categoryName = data.categoryName
        /* 新增模式的commodityTypeName是commodityTypeId */
        const commodityTypeId = data.commodityTypeName
        const ordering = data.ordering
        setBtnLoading(true)
        saveOrEditSend({
          variables: {
            categoryInput: {
              categoryName,
              commodityTypeId,
              ordering,
            },
          },
        })
          .then(() => {
            setBtnLoading(false)
            message.success('保存成功')
            setVisible(false)
            /* 保存并继续添加恢复默认值 */
            formRef.current?.form.resetFields()
            onSuccess?.()
          })
          .catch(() => {
            setBtnLoading(false)
          })
      })
      .catch(() => {})
  }
  /* 保存并继续添加 */
  const keepContinue = () => {
    formRef.current?.form
      .validateFields()
      .then((data) => {
        const categoryName = data.categoryName
        const commodityTypeId = data.commodityTypeName
        const ordering = data.ordering
        setBtnLoading(true)
        saveOrEditSend({
          variables: {
            categoryInput: {
              categoryName,
              commodityTypeId,
              ordering,
            },
          },
        })
          .then(() => {
            setBtnLoading(false)
            message.success('保存成功')
            /* 保存并继续添加默认排序+1操作 */
            let orderingNum = formRef.current?.form.getFieldValue(['ordering'])
            formRef.current?.form.resetFields(['commodityTypeName', 'categoryName'])
            formRef.current?.form.setFieldsValue({ ordering: orderingNum + 1 })
            onSuccess?.()
          })
          .catch(() => {
            setBtnLoading(false)
          })
      })
      .catch(() => {})
  }

  /* 保存 */
  const handleSave = () => {
    formRef.current?.form
      .validateFields()
      .then((data) => {
        const categoryId = data.categoryId
        const categoryName = data.categoryName
        const commodityTypeId = data.commodityTypeId
        const ordering = data.ordering
        setBtnLoading(true)
        saveOrEditSend({
          variables: {
            categoryInput: {
              categoryId,
              categoryName,
              commodityTypeId,
              ordering,
            },
          },
        })
          .then(() => {
            setBtnLoading(false)
            message.success('保存成功')
            setVisible(false)
            onSuccess?.()
          })
          .catch(() => {
            setBtnLoading(false)
          })
      })
      .catch(() => {})
  }

  return (
    <Modal
      maskClosable={false}
      title={titleText.current}
      width={600}
      visible={visible}
      onCancel={() => {
        setVisible(false)
      }}
      centered
      destroyOnClose
      footer={[
        <Button
          disabled={btnLoading}
          key="back"
          onClick={() => {
            setVisible(false)
          }}>
          取消
        </Button>,
        <span key="cancelSpan" style={{ padding: '0 10px' }}>
          {mode === 'editMode' ? null : (
            <Button loading={btnLoading} key="cancel" type="primary" onClick={handleSaveBack}>
              保存并返回
            </Button>
          )}
        </span>,
        <span key="submitSpan">
          {mode === 'editMode' ? (
            <Button loading={btnLoading} key="submit" type="primary" onClick={handleSave}>
              保存
            </Button>
          ) : (
            <Button loading={btnLoading} key="submit" type="primary" onClick={keepContinue}>
              保存并继续添加
            </Button>
          )}
        </span>,
      ]}>
      <NewOrEditForm ref={formRef} initialValues={initialValues} mode={mode} ordering={ordering} />
    </Modal>
  )
}

export default EditModal

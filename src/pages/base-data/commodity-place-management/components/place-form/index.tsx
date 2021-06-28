import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input } from 'antd'
import { FormInstance, useForm } from 'antd/lib/form/Form'
import LabelValue from '@/components/label-value'

interface InitialValues {
  placeName: string
  parentPlaceName: string
}
interface IProps {
  initialValues?: InitialValues
}
export interface Ref {
  form: FormInstance<{
    placeName: string
  }>
}

const PlaceForm = forwardRef<Ref, IProps>(({ initialValues = {} }, ref) => {
  const [form] = useForm()
  useImperativeHandle(ref, () => ({
    form,
  }))
  const { placeName, parentPlaceName } = initialValues
  return (
    <Form
      form={form}
      initialValues={{
        placeName,
      }}
      layout="vertical"
      labelCol={{
        span: 4,
      }}>
      <Form.Item noStyle>
        <LabelValue marginBottom={16} label="上级产地">
          {parentPlaceName}
        </LabelValue>
      </Form.Item>
      <Form.Item label="产地名称" name="placeName" rules={[{ required: true, message: '请输入产地名称' }]}>
        <Input autoFocus maxLength={10} placeholder="请输入（不超过10个字）" />
      </Form.Item>
    </Form>
  )
})

export default PlaceForm

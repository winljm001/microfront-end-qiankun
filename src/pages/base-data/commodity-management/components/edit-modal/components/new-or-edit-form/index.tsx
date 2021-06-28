import { useQuery } from '@apollo/client'
import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { forwardRef, useImperativeHandle } from 'react'
import { getCommodityType } from '@/graphql/gqls/baseData/commodityCategoryManagement'
import { FormRef } from '../../index'
import styles from './style.module.less'

/* 新增or编辑模式 */
export type EditMode = 'editMode' | 'addMode' | null

export interface InitialValues {
  commodityTypeId: number
  commodityTypeName: string
  categoryId: number
  categoryName: string
  ordering: number
}

interface IProps {
  /*  初始化值 */
  initialValues?: InitialValues

  /* 新增or编辑模式 */
  mode: EditMode
  /* 新增模式默认排序值 */
  ordering?: number
}

const NewOrEditForm = forwardRef<FormRef, IProps>(({ initialValues, mode, ordering }, ref) => {
  const [form] = useForm()
  useImperativeHandle(ref, () => ({
    form,
  }))
  /* 获取商品类型下拉选项数据 */
  const { data } = useQuery(getCommodityType)
  return (
    <Form form={form} initialValues={{ ordering, ...initialValues }} layout="vertical">
      <Form.Item name="commodityTypeId" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="categoryId" hidden>
        <Input />
      </Form.Item>
      <Form.Item label="商品类型" name="commodityTypeName" rules={[{ required: true, message: '请选择商品类型!' }]}>
        {mode === 'editMode' ? (
          <Input bordered={false} />
        ) : (
          <Select options={data?.commodityList} placeholder="全部" className={styles.select} />
        )}
      </Form.Item>

      <Form.Item label="分类名称" name="categoryName" rules={[{ required: true, message: '请输入分类名称!' }]}>
        <Input maxLength={10} placeholder="请输入（不超10个字）" />
      </Form.Item>

      <Form.Item
        label="分类排序"
        name="ordering"
        rules={[
          { required: true, message: '请输入分类排序!' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数!' },
        ]}>
        <Input placeholder="请输入数字" />
      </Form.Item>
    </Form>
  )
})
export default NewOrEditForm

import React, { FC } from 'react'
import { Form, Row, Col, Input, Button, Select, FormInstance, Space } from 'antd'
import { useQuery } from '@apollo/client'
import { getCommodityType } from '@/graphql/gqls/baseData/commodityCategoryManagement'
import { listSearchFromItemProps } from '@/config/defaultSettings'

interface IProps {
  /* 查询之后刷新列表 */
  submit: (categoryName: string, commodityTypeId: number) => void
  reset: () => void
}

const baseOptions = [
  {
    label: '全部',
    value: 0,
  },
]

const Filter: FC<IProps> = ({ submit, reset }) => {
  const [form] = Form.useForm<FormInstance>()

  /* 获取商品类型数据 */
  const { data } = useQuery(getCommodityType)

  /* 提交表单 */
  const onFinish = (values) => {
    /* 下面Select不能使用defaultValue，所以判断一下他是字符串还是数字 */
    const newCommodityTypeId = values.commodityTypeName === '全部' ? 0 : values.commodityTypeName
    const categoryName: string = values.categoryName
    const commodityTypeId: number = newCommodityTypeId
    submit(categoryName, commodityTypeId)
  }
  /* const options: typeof baseOptions =
    data?.commodityList?.map((item) => ({
      label: item.label as string,
      value: item.value as number,
    })) || [] */
  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
      initialValues={{ commodityTypeName: '全部' }}>
      <Row {...listSearchFromItemProps.rowProps}>
        <Col {...listSearchFromItemProps.colProps}>
          <Form.Item name="commodityTypeName" label="商品类型">
            <Select>
              {baseOptions.concat(data?.commodityList).map((item) => {
                return (
                  <Select.Option key={item?.value} value={item?.value}>
                    {item?.label}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col {...listSearchFromItemProps.colProps}>
          <Form.Item name="categoryName" label="商品分类">
            <Input placeholder="请输入查询" />
          </Form.Item>
        </Col>
        <Col {...listSearchFromItemProps.colProps}>
          <Form.Item>
            <Space size={24}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                onClick={() => {
                  reset()
                  form.resetFields()
                }}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Filter

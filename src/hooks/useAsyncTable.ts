import { useAntdTable } from 'ahooks'
import { PaginatedParams } from 'ahooks/lib/useAntdTable'
import useUrlState from '@ahooksjs/use-url-state'
import { Form } from 'antd'
import { useEffect } from 'react'
interface IProps {
  /** 请求 */
  fetchAction: (params: any) => Promise<any>
  // 是否缓存
  isCache?: boolean
  // 是否手动调用
  manual?: boolean
  extraParams?: any
}
const useAsyncTable = (props: IProps) => {
  const { fetchAction, isCache = true, manual = false, extraParams = {} } = props

  const getTableData = ({ current, pageSize }: PaginatedParams[0], formData: Object) => {
    const fetchParams = { pageCurrent: current, pageSize, ...formData, ...extraParams }
    // 需要改生成的services,只传参数的形式
    return fetchAction(fetchParams).then((res) => {
      const {
        data: { totalRecords, records },
      } = res
      return { total: totalRecords, list: records }
    })
  }
  const [form] = Form.useForm()

  // 缓存逻辑开始

  const [cacheParams, setCacheParams] = useUrlState({})

  const defaultParamsObj: any = isCache
    ? JSON.stringify(cacheParams) !== '{}'
      ? { defaultParams: [cacheParams, cacheParams] }
      : {}
    : {}
  // 缓存逻辑结束
  const { tableProps, params, search, refresh } = useAntdTable(
    (data) => {
      return getTableData(data, form.getFieldsValue())
    },
    {
      ...defaultParamsObj,
      manual,
      form,
    },
  )
  useEffect(() => {
    if (isCache) {
      if (params?.length > 1) {
        setCacheParams({ ...params[0], ...params[1] })
      }
    }
  }, [params])
  const { submit, reset } = search
  tableProps['pagination'].showSizeChanger = true
  tableProps['pagination'].showTotal = (total) => `共 ${total} 记录`
  return { tableProps, search, form, submit, reset, refresh }
}

export default useAsyncTable

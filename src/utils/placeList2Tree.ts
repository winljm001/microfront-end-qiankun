import { Place } from '@/graphql/types'

/** 树节点数据类型定义 */
export interface TreeNodeData {
  key: number
  title: string
  parentKey: number
  children: TreeNodeData[]
}
/**
 * 根据后端返回的产地list生成antd treeData数据格式
 * @param list 产地list
 * @returns treeData
 */
export default function buildTree(list: Place[]) {
  let temp: { [prop: string]: TreeNodeData } = {}
  let tree: TreeNodeData[] = []
  list.forEach((item) => {
    temp[item.placeId!] = {
      key: item.placeId!,
      title: item.placeName!,
      parentKey: item.placePid!,
      children: [],
    }
  })

  list.forEach((item) => {
    const node = temp[item.placeId!]
    if (item.placePid) {
      temp[item.placePid]?.children?.push(node)
    } else {
      tree.push(node)
    }
  })
  return tree
}

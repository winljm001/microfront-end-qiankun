import React, { FC } from 'react'
import { TreeDataNode, Space } from 'antd'
import { FileAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import styles from './index.module.less'

type Action = (nodeData: TreeDataNode) => void

interface IProps {
  nodeData: TreeDataNode
  onAdd: Action
  onEdit: Action
  onDelete: Action
}
// 树节点
const TreeNodeTitle: FC<IProps> = ({ nodeData, onAdd, onEdit, onDelete }) => {
  return (
    <div className={styles.wrap}>
      <Space>
        <span>{nodeData.title}</span>
        <div className={classnames(styles.actionGroup)}>
          <Space>
            <span title="新增子节点">
              <FileAddOutlined
                className={styles.action}
                onClick={() => {
                  onAdd(nodeData)
                }}
              />
            </span>
            <span title="编辑节点">
              <EditOutlined
                className={styles.action}
                onClick={() => {
                  onEdit(nodeData)
                }}
              />
            </span>
            <span title="删除节点">
              <DeleteOutlined
                className={styles.action}
                onClick={() => {
                  onDelete(nodeData)
                }}
              />
            </span>
          </Space>
        </div>
      </Space>
    </div>
  )
}

export default TreeNodeTitle

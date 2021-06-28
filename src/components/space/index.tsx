import React from 'react'
import { Space, SpaceProps } from 'antd'
import classnames from 'classnames'
import styles from './index.module.less'

interface IProps extends SpaceProps {
  display?: 'inline' | 'block'
}

const CustomSpace: React.FC<IProps> = ({ display = 'block', className, ...props }) => {
  return <Space {...props} className={classnames(styles[display], className)} />
}

export default CustomSpace

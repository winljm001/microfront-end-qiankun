import React, { CSSProperties } from 'react'
import classnames from 'classnames'
import styles from './index.module.less'

interface IProps {
  children?: React.ReactNode
  colon?: boolean
  label?: string
  marginTop?: CSSProperties['marginBottom']
  marginBottom?: CSSProperties['marginBottom']
  wrapClass?: string
  labelClass?: string
  valueClass?: string
}

const LabelValue: React.FC<IProps> = ({
  children,
  label,
  marginTop,
  marginBottom,
  wrapClass,
  labelClass,
  valueClass,
  colon = true,
}) => {
  const defaultWrapStyle: CSSProperties = {}
  if (marginTop !== undefined) {
    defaultWrapStyle.marginTop = marginTop
  }
  if (marginBottom !== undefined) {
    defaultWrapStyle.marginBottom = marginBottom
  }
  return (
    <div className={classnames(styles.wrap, wrapClass)} style={defaultWrapStyle}>
      {label && (
        <label className={classnames(styles.label, labelClass)}>
          {label}
          {colon && '：'}
        </label>
      )}
      <span className={classnames(styles.value, valueClass)}>{children}</span>
    </div>
  )
}

export default LabelValue

import React, { memo } from 'react'
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config'

const BlankLayout: React.FC<RouteConfigComponentProps> = memo((props) => {
  const { route } = props
  return renderRoutes(route?.routes)
})
export default BlankLayout

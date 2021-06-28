import React, { useLayoutEffect, useState } from 'react'
import Loading from '@/components/loading'
import { LOGIN_PATH } from '@/router/config/path'
import { history } from '@/router'
import storage from '@/utils/storage'
import config from '@/config'

function auth<T extends object>(Component: React.FC<T>): React.FC<T> {
  return (props) => {
    const [loginStatus, setLoginStatus] = useState(false)
    useLayoutEffect(() => {
      const token = storage.getItem(config.authKey)
      if (!token) {
        history.replace(LOGIN_PATH)
      } else {
        setLoginStatus(true)
      }
    }, [])
    if (loginStatus) {
      return <Component {...props} />
    }
    return <Loading />
  }
}

export default auth

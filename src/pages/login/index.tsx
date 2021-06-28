import React, { useState } from 'react'
import { useMount } from 'ahooks'
import { Button, Form, Input } from 'antd'
import { SafetyOutlined, TabletOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import useGlobalStore from '@/stores/global'
import { BASE_PATH } from '@/router/config/path'
import { requestLogin } from '@/graphql/gqls/login/login'
import { MutationLoginArgs, UserLoginResponse } from '@/graphql/types'
import config from '@/config'
import { history } from '@/router'
import storage from '@/utils/storage'
import img from './images/logo.png'
import styles from './style.module.less'

const Login: React.FC = () => {
  // 创建loading实现加载
  const [loading, setLoading] = useState(false)
  // Form实例化
  const [form] = Form.useForm()
  const { logout } = useGlobalStore()
  useMount(() => {
    logout()
  })
  const [login] = useMutation<{ login: UserLoginResponse }, MutationLoginArgs>(requestLogin)
  // 登录按钮提交
  const onFinish = (values) => {
    setLoading(true)
    login({
      variables: {
        loginInput: values,
      },
    })
      .then((res) => {
        setLoading(false)
        // 本地存入token
        storage.setItem(config.authKey, res.data!.login.token!)
        // 存入globalState
        useGlobalStore.setState({
          userInfo: {
            /** 用户名 */
            username: res.data!.login.userName!,
            /** 公司名 */
            orgName: res.data!.login.organizationName!,
          },
        })
        history.replace(BASE_PATH)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  return (
    <div className={styles.login}>
      <div className={styles.bg}>
        <div className={styles.text}>
          <p className={styles.textCh}>全球水果链，共享幸福果</p>
          <p className={styles.textEn}>
            WITH GLOBAL FRUIT CHAIN,
            <br /> WE SHARE THE FRUIT OF HAPPINESS.
          </p>
        </div>
      </div>
      <div className={styles.loginBox}>
        <img src={img} alt="" className={styles.logo} />
        <div className={styles.title}>星桥生产运营支撑平台</div>
        <div className={styles.formBox}>
          <Form form={form} name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
            {/* 用户 */}
            <Form.Item
              name="username"
              className={styles.formInput}
              rules={[{ required: true, message: '请输入登录账号!' }]}>
              <Input className={styles.inputUser} placeholder="请输入登录账号" prefix={<TabletOutlined />} />
            </Form.Item>
            {/* 密码 */}
            <Form.Item>
              <Form.Item className={styles.formInputB}>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                  <Input.Password style={{ height: 40 + 'px' }} placeholder="请输入密码" prefix={<SafetyOutlined />} />
                </Form.Item>
              </Form.Item>
            </Form.Item>
            {/* 登录 */}
            <Form.Item shouldUpdate>
              {({ getFieldError, getFieldValue }) => {
                let disabled = true
                const userErr = getFieldError('username')
                const userValue = getFieldValue('username')
                const codeErr = getFieldError('password')
                const codeValue = getFieldValue('password')
                if (userErr[0] || codeErr[0]) {
                  disabled = true
                } else if (!userValue || !codeValue) {
                  disabled = true
                } else {
                  disabled = false
                }
                return (
                  <Form.Item>
                    <Button
                      loading={loading}
                      disabled={disabled}
                      block
                      className={styles.btnB}
                      type="primary"
                      htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                )
              }}
            </Form.Item>
          </Form>
        </div>
        <div className={styles.record}>&copy; 169 1987-2021 重庆洪九果品股份有限公司 渝ICP备19002690号-7</div>
      </div>
    </div>
  )
}

export default Login

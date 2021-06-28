import { gql } from '@apollo/client'

// 登录
export const requestLogin = gql`
  mutation login($loginInput: LoginInput) {
    login(loginInput: $loginInput) {
      userName
      token
      organizationName
    }
  }
`

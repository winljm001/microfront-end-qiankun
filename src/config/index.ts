/**
 * 配置文件
 */
interface CommonConfig {
  /** 权限key */
  authKey: string
}
interface EnvConfig {
  /** api host */
  apiHost: string
  /** 项目根路径 */
  baseUrl: string
}
export interface IConfig extends CommonConfig, EnvConfig {}

const env = import.meta.env?.VITE_APP_ENV
// 配置(公共)
const commonConfig: CommonConfig = {
  authKey: 'Authorization',
}
// 配置(根据环境变量区分)
export const envConfig: Record<typeof env, EnvConfig> = {
  // 开发环境
  dev: {
    apiHost: 'https://mdm-dev.hjgpscm.com',
    baseUrl: '/',
  },
  // 测试环境
  test: {
    apiHost: 'https://mdm-test.hjgpscm.com',
    baseUrl: '/',
  },
  // 生产环境
  prod: {
    apiHost: 'https://pitaya.hjgpscm.com',
    baseUrl: '/',
  },
}
const config = { ...commonConfig, ...envConfig[env] }
export default config

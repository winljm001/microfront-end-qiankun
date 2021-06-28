import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { CustomRouteConfig } from '@/router/config/types.td'
import storage from '@/utils/storage'
import config from '@/config'
import { getMenuConfigByRoutes } from '@/utils/route'
import { mainRoutes } from '@/router/config'

export type State = {
  /** menuConfig */
  menuConfig: CustomRouteConfig[]
  /** 用户信息 */
  userInfo: {
    /** 用户名 */
    username: string | null
    /** 组织名 */
    orgName: string | null
  }
  /** 用户设置 */
  userSetting: {
    /** 菜单是否收起 */
    collapsed: boolean | null
  }
  /** 保存登录数据 */
  saveLoginData: (value: Pick<State, 'userInfo'>) => void
  // 设置用户个性化设置
  setUserSetting: (value: Partial<State['userSetting']>) => void
  /** 退出 */
  logout: (callback?: () => void) => void
}
export const name = 'global-store'
const useGlobalStore = create<State>(
  devtools(
    // 本地存储，其他store不需要
    persist(
      (set, get) => {
        return {
          menuConfig: getMenuConfigByRoutes(mainRoutes),
          userInfo: {
            username: '',
            orgName: '',
          },
          userSetting: {
            collapsed: null,
          },
          saveLoginData: ({ userInfo }) => {
            set({ userInfo })
          },
          setUserSetting: (value) => {
            set({ userSetting: { ...get().userSetting, ...value } })
          },
          // 退出登录、清空token和用户数据
          logout: (callback) => {
            storage.removeItem(config.authKey)
            set({ userInfo: { username: '', orgName: '' } })
            callback?.()
          },
        }
      },
      {
        name,
        getStorage: () => storage,
        // Only these props will be persisted
        whitelist: ['userSetting', 'userInfo'],
      },
    ),
  ),
)

export default useGlobalStore

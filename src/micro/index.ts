import { registerMicroApps, initGlobalState, addGlobalUncaughtErrorHandler, start } from 'qiankun'

// 微应用注册信息
import apps from './apps'

/**
 * 在主应用注册微应用的信息:
 * 第一个参数-微应用的注册信息
 * 第二个参数-全局生命周期钩子
 */
registerMicroApps(apps, {
  beforeLoad: (app) => {
    console.log('before load', app.name)
    return Promise.resolve()
  },
  beforeMount: async (d) => {
    console.log(d)
  },
  beforeUnmount: async () => {},
  afterMount: (app) => {
    console.log('after mount', app.name)
    return Promise.resolve()
  },
})

// 通讯
/**
 * 首先注册一个MicroAppStateActions实例，该实例有三个方法：
 * 1、setGlobalState：设置globalState——设置新值时，内部执行浅检查，检查到global发生变化，通知所有观察者函数
 * 2、onGlobalStateChange：注册观察者函数——响应globalState
 */

const stateInfo = {
  msg: 'init in main',
  person: {
    name: 'Mary',
    age: 15,
    info: 'I am from main',
  },
}
// 初始化state
const actions = initGlobalState(stateInfo)
// 在项目中任何需要监听的地方监听
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态；prev变更前的状态
  console.log('main state change after---before', state, prev)
})

// 添加全局的未捕获异常处理器
addGlobalUncaughtErrorHandler((event) => {
  console.log('error', event)
})

// 导出qiankun的启动函数
export default start

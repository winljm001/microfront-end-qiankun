// 微应用的信息
const apps = [
  /**
   * name：微应用名称-具有唯一性
   * entry：微应用入口-通过该地址加载微应用
   * container：微应用挂载节点-微应用加载完成后将挂载在该节点上
   * activeRule：微应用的激活规则-触发路由规则后将加载该微应用
   *
   * 微应用信息注册完成后，一旦浏览器的url发生变化，便会自动触发qiankun的匹配逻辑，
   * 所有activeRule匹配上的微应用就会被插入到指定的container中，同时依次调用微应用暴露出的生命周期钩子。
   */
  {
    name: '@hj/content-app',
    entry: 'http://localhost:8000',
    container: '#frame',
    activeRule: '/',
    props: {},
  },
]

export default apps

import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  // installed 确保执行一次
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (
      isDef(i) &&
      isDef((i = i.data)) &&
      isDef((i = i.registerRouteInstance))
    ) {
      // vm 是 RouteView 实例
      // i 是 registerRouteInstance，挂在data上
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        // this vue根实例
        this._routerRoot = this
        // VueRouter 实例 new Vue 时传入
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // 原型上添加$router
  Object.defineProperty(Vue.prototype, '$router', {
    get () {
      return this._routerRoot._router
    }
  })

  // 原型上添加$route
  Object.defineProperty(Vue.prototype, '$route', {
    get () {
      return this._routerRoot._route
    }
  })

  // 注册组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate =
    strats.created
}

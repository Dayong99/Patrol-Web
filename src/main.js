import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css


import './assets/icon/iconfont.css'
import './assets/icon/iconfont.js'

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './utils/error-log' // error log
import request from '@/utils/request'
import '../public/static/config.js'
import lodash from 'lodash'
import echarts from 'echarts'

import * as filters from './filters' // global filters
import { hasPermission, hasNoPermission, hasAnyPermission } from './utils/permissionDirect'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// import Print from '@/plugs/print'
// import Print from 'vue-print-nb'
// Vue.use(Print)

import "@/utils/drag-dialog.js"

import Print from '@/plugs/print'
Vue.use(Print) // 注册

const Plugins = [
    hasPermission,
    hasNoPermission,
    hasAnyPermission
]

Plugins.map((plugin) => {
    Vue.use(plugin)
})

Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
})

Vue.use(Viewer, {
    defaultOptions: {
        zIndex: 9999
    }
})

Vue.prototype.$jsonPost = request.jsonPost
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$getbuffer = request.getbuffer
Vue.prototype.$download = request.download
Vue.prototype.$downloadGet = request.downloadGet
Vue.prototype.$downloadZip = request.downloadZip

Vue.prototype.$upload = request.upload
Vue.prototype.$getLocal = request.getLocal
Vue.prototype.$login = request.login
Vue.prototype.$_ = lodash
Vue.prototype.$echarts = echarts
Vue.prototype.$np = NProgress

import common from './utils/common.js'
Vue.prototype.common = common



// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
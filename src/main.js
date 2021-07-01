import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import iconPicker from 'vue-fontawesome-elementui-icon-picker'
import ElTreeSelect from 'el-tree-select'
import CKEditor from '@ckeditor/ckeditor5-vue'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/blobFix' // fix toBlob in Edge
import VueClipboard from 'vue-clipboard2'
import colorPicker from 'vcolorpicker'
import '@/styles/vue-fabric.min.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

ElementUI.Dialog.props.closeOnClickModal.default = false

// set ElementUI lang to EN
Vue.use(ElementUI, {
  // locale: 'cn',
  locale,
  size: 'small'
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 设置图标选择器
Vue.use(iconPicker)
// 设置树形选择器
Vue.use(ElTreeSelect)
Vue.use(colorPicker)
// 设置富文本编辑器
Vue.use(CKEditor)
// 复制功能
Vue.use(VueClipboard)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

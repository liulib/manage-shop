import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入api接口
import api from './api/index'
// 导入全局的样式
import './assets/css/global.css'
// 导入字体样式
import './assets/fonts/iconfont.css'
// 导入第三方插件vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'
// 时间处理插件
import moment from 'moment'
// 富文本编辑器相关
import VueQuillEditor from 'vue-quill-editor'

// import { Message, MessageBox } from 'element-ui'
// Vue.use(Message).use(MessageBox)

// 挂载全局过滤器
Vue.filter('moment', function(value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm'
  // return moment(value).format(formatString) // value可以是普通日期 20170723
  return moment.unix(value).format(formatString) // 这是时间戳转时间
})

Vue.config.productionTip = false

// 将api挂载到vue的原型上
Vue.prototype.$api = api
// // 将全局弹窗挂载到vue的原型上
// Vue.prototype.$message = Message
// // 挂载confirm到原型上
// Vue.prototype.$confirm = MessageBox.confirm
// 注册tree-table
Vue.component('tree-table', ZkTable)

// 挂载富文本编辑器
Vue.use(VueQuillEditor /* { default global options } */)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

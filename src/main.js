import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入api接口
import api from './api/index'
// 导入全局的样式
import './assets/css/global.css'
// 导入element-ui样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体样式
import './assets/fonts/iconfont.css'

import { Input, Form, FormItem, Button, Message } from 'element-ui'

Vue.use(Input)
  .use(Form)
  .use(FormItem)
  .use(Button)

Vue.config.productionTip = false

// 将api挂载到vue的原型上
Vue.prototype.$api = api
// 将全局弹窗挂载到vue的原型上
Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

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

import {
  Input,
  Form,
  FormItem,
  Button,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Tooltip,
  Dialog,
  MessageBox
} from 'element-ui'

Vue.use(Input)
  .use(Form)
  .use(FormItem)
  .use(Button)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(MenuItemGroup)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Row)
  .use(Col)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Pagination)
  .use(Tooltip)
  .use(Dialog)

Vue.config.productionTip = false

// 将api挂载到vue的原型上
Vue.prototype.$api = api
// 将全局弹窗挂载到vue的原型上
Vue.prototype.$message = Message
// 挂载confirm到原型上
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

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
// 导入第三方插件vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'
// 时间处理插件
import moment from 'moment'
// 富文本编辑器相关
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem
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
  .use(Tag)
  .use(Tree)
  .use(Select)
  .use(Option)
  .use(Cascader)
  .use(Alert)
  .use(Tabs)
  .use(TabPane)
  .use(Steps)
  .use(Step)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(Upload)
  .use(Timeline)
  .use(TimelineItem)

// 挂载全局过滤器
Vue.filter('moment', function(value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm'
  // return moment(value).format(formatString) // value可以是普通日期 20170723
  return moment.unix(value).format(formatString) // 这是时间戳转时间
})

Vue.config.productionTip = false

// 将api挂载到vue的原型上
Vue.prototype.$api = api
// 将全局弹窗挂载到vue的原型上
Vue.prototype.$message = Message
// 挂载confirm到原型上
Vue.prototype.$confirm = MessageBox.confirm
// 注册tree-table
Vue.component('tree-table', ZkTable)

// 挂载富文本编辑器
Vue.use(VueQuillEditor /* { default global options } */)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Category from '../components/goods/Category.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import AddGood from '../components/goods/AddGood.vue'
import Orders from '../components/orders/Orders.vue'

Vue.use(VueRouter)

// 修复Vue router / Element 重复点击导航路由报错解决方法
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/home',
    component: Home,
    name: 'home',
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Category },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGood },
      { path: '/orders', component: Orders }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 使用路由导航 判断是否能进入页面
router.beforeEach((to, from, next) => {
  // 登录页面直接放行
  if (to.path === '/login') {
    return next()
  }
  // 其他页面判断是否有token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next({ name: 'login' })
  }
  next()
})

export default router

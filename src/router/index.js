import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue'
  )

const Users = () =>
  import(/* webpackChunkName: "Users" */ '../components/users/Users.vue')

const Rights = () =>
  import(
    /* webpackChunkName: "Rights_Roles" */ '../components/power/Rights.vue'
  )
const Roles = () =>
  import(/* webpackChunkName: "Rights_Roles" */ '../components/power/Roles.vue')

const Category = () =>
  import(
    /* webpackChunkName: "Category_Params_Goods" */ '../components/goods/Category.vue'
  )
const Params = () =>
  import(
    /* webpackChunkName: "Category_Params_Goods" */ '../components/goods/Params.vue'
  )
const Goods = () =>
  import(
    /* webpackChunkName: "Category_Params_Goods" */ '../components/goods/Goods.vue'
  )
const AddGood = () =>
  import(
    /* webpackChunkName: "Category_Params_Goods" */ '../components/goods/AddGood.vue'
  )

const Orders = () =>
  import(/* webpackChunkName: "Orders" */ '../components/orders/Orders.vue')

const Reports = () =>
  import(/* webpackChunkName: "Reports" */ '../components/reports/Reports.vue')

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
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
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

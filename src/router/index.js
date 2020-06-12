import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/home', component: Home, name: 'home' }
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

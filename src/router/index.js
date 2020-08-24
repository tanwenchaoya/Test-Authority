import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import UsersAuth from "../components/user/UsersAuth";
import Roles from "../components/role/Roles";
import RolesAuth from "../components/role/RolesAuth";
import Organizes from "../components/organizes/Organizes";
import OrganizesAuth from "../components/organizes/OrganizesAuth";
import LoginLogs from "../components/logs/loginLogs";
import OperateLogs from "../components/logs/OperateLogs";
import Menus from "../components/menu/Menus";
/* const Login = (resolve) => {
  import('../components/Login').then((module) => {
    resolve(module)
  })
} */
Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/home', component: Home,
    redirect: '/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path: '/usersAuth',component: UsersAuth},
      {path:'/roles',component:Roles},
      {path:'/rolesAuth',component:RolesAuth},
      {path: '/organizes',component: Organizes},
      {path: '/organizesAuth',component: OrganizesAuth},
      {path: '/loginLogs',component: LoginLogs},
      {path: '/operateLogs',component: OperateLogs},
      {path: '/menus',component: Menus}
    ]
  }
]

const router = new VueRouter({
  routes
})
/*
* to表示将要访问的路径
* from 表示从哪个路径来
* next 是一个函数，表示放行 next()直接放行，next(/xxx)强制跳转
*
* */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router

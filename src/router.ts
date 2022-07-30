/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import ColumnDetail from './pages/ColumnDetail.vue'
import CreatePost from './pages/CreatePost.vue'
import store from './store'
// 一般采用history模式，不采用hash模式
const routerHistory = createWebHistory()
const router = createRouter({
    // 调用这个函数返回一个路由器实例对象，里面是一些配置
    // 第一个必填参数为history，它决定你要用什么类型的路由
    history: routerHistory,
    // 这里就像之前Vue2学的那样，定义路由规则
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { redirectAlreadyLogin: true }
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup,
            meta: { redirectAlreadyLogin: true }
        },
        {
            path: '/create',
            name: 'create',
            component: CreatePost,
            meta: {
                requiredLogin: true
            }
        },
        {
            // 设置动态路径参数
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        }
    ]
})
router.beforeEach((to, from, next) => {
    // 如果没登录则跳转到登录界面
    if (to.meta.requiredLogin && !store.state.user.isLogin) {
        next({ name: 'login' })
    } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
        next('/')
    } else {
        next()
    }
})

export default router
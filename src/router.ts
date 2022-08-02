/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import ColumnDetail from './pages/ColumnDetail.vue'
import CreatePost from './pages/CreatePost.vue'
import PostDetail from './pages/PostDetail.vue'
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
        },
        {
            path: '/posts/:id',
            name: 'post',
            component: PostDetail
        }
    ]
})
router.beforeEach((to, from, next) => {
    const { user, token } = store.state
    const { requiredLogin, redirectAlreadyLogin } = to.meta
    if (!user.isLogin) {
        // 没有登录的
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
            store.dispatch('fetchCurrentUser').then(() => {
                if (redirectAlreadyLogin) {
                    next('/')
                } else {
                    next()
                }
            }).catch(e => {
                // 如果这里失败了，说明token过期了，要把过期的token删除掉
                console.error(e)
                store.commit('logout')
                next('login')
            })
        } else {
            if (requiredLogin) {
                next('login')
            } else {
                next()
            }
        }
    } else {
        // 已经登录的
        if (redirectAlreadyLogin) {
            next('/')
        } else {
            next()
        }
    }
})

export default router
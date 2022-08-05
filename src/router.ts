/* eslint-disable */
import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Signup from './pages/Signup.vue'
import ColumnDetail from './pages/ColumnDetail.vue'
import CreatePost from './pages/CreatePost.vue'
import PostDetail from './pages/PostDetail.vue'
import EditProfile from './pages/EditProfile.vue'
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
        },
        {
            path: '/edit',
            name: 'edit',
            component: EditProfile,
            meta: { requiredLogin: true }
        }
    ]
})
router.beforeEach((to, from, next) => { // 全局路由守卫，初始化的时候 和 每次路由切换之前被调用
    const { user, token } = store.state
    const { requiredLogin, redirectAlreadyLogin } = to.meta
    if (!user.isLogin) {
        //页面刷新会导致存在store的isLogin初始化为false，如果本地有token说明已经登录了
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
                // 因为这个requiredLogin和redirectAlreadyLogin都是从to中解构出来的，所以意思就是当你跳转到的目标路由的路由元信息规定你要登录才能访问，那就给你跳转到login去，如果你已经登录，去访问元信息中是redirectAlreadyLogin的路由，那么就给你重定向到首页
                next('login')
            } else {
                next()
            }
        }
    } else {
        // 已经登录的
        if (redirectAlreadyLogin) {
            //此时再从地址栏访问meta中带有redirectAlreadyLogin属性的路由，会被重定向到首页
            next('/')
        } else {
            next()
        }
    }
})

export default router
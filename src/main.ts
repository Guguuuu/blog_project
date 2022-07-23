/* eslint-disable */
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import ColumnDetail from './pages/ColumnDetail.vue'
import App from './App.vue'

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
            component: Login
        },
        {
            // 设置动态路径参数
            path: '/column/:id',
            name: 'column',
            component: ColumnDetail
        }
    ]
})
const app = createApp(App)
// 没记错的话，Vue2中的Vue.的写法都变成了app.  之前是Vue.use(xxx)
app.use(router)
app.mount('#app')

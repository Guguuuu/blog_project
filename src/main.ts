/* eslint-disable */
import { createApp } from 'vue'
import axios from 'axios';
import router from './router'
import store from './store'

import App from './App.vue'

/* 如果在每次发请求的地方，多次加上这种commit('setLoading',true)信息来触发mutation
store.ts中呢，仅仅只是有一个getAndCommit方法，后面还要post请求 update请求，甚至delete请求
都要重复写copy这段逻辑，所以每次出现copy粘贴的场景，就可以优化

这时候axios来帮我们了，它里面有一个特性叫interceptors拦截器
拦截器就是能在全局层面，拦截到在请求发送时 和 响应返回时的一个状态
然后我们可以在对应的钩子函数中进行一些逻辑操作

我们只需要在请求的时候呢，把Loading设置为true，返回的时候设置为false */
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
    //利用拦截器，不用每次都输入这个icode
    config.params = { ...config.params, icode: '04D4AF3D4966A05E' }
    store.commit('setLoading', true)
    return config
})
axios.interceptors.response.use(config => {
    store.commit('setLoading', false)
    return config
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

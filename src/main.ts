/* eslint-disable */
import { createApp } from 'vue'
import axios from 'axios';
import router from './router'
import store from './store'

import App from './App.vue'
import 'easymde/dist/easymde.min.css'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
    // 其他代码
    store.commit('setLoading', true)
    // 因为错误提交第一次之后error的状态就为true了，再次提交就不会显示错误信息组件，所以我们每次请求的时候把error的status设置为false
    store.commit('setError', { status: false, message: '' })

    // get请求，添加到URL中
    config.params = { ...config.params, icode: '04D4AF3D4966A05E' }
    // 其他请求，添加到body中
    // 如果是上传文件，添加到FormData中
    if (config.data instanceof FormData) {
        config.data.append('icode', '04D4AF3D4966A05E')
    } else {
        // 普通的body对象，添加到data中
        config.data = { ...config.data, icode: '04D4AF3D4966A05E' }
    }
    return config
})
axios.interceptors.response.use(config => {
    store.commit('setLoading', false)
    return config
}, e => {
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(error)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

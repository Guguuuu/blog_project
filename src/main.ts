/* eslint-disable */
import { createApp } from 'vue'
import axios from 'axios';
import router from './router'
import store from './store'

import App from './App.vue'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
    //利用拦截器，不用每次都输入这个icode && 每次请求前将loading设置为true触发Loading效果
    config.params = { ...config.params, icode: '04D4AF3D4966A05E' }
    store.commit('setLoading', true)
    return config
})
axios.interceptors.response.use(config => {
    //每次请求前将loading设置为false结束Loading效果
    store.commit('setLoading', false)
    return config
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

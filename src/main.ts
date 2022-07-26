/* eslint-disable */
import { createApp } from 'vue'
import axios from 'axios';
import router from './router'
import store from './store'

import App from './App.vue'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
//利用拦截器，不用每次都输入这个icode
axios.interceptors.request.use(config => {
    config.params = { ...config.params, icode: '04D4AF3D4966A05E' }
    return config
})
axios.get('/columns').then(response => {
    console.log(response.data);
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

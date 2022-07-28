/* eslint-disable */
import { createApp } from 'vue'
import axios from 'axios';
import router from './router'
import store from './store'

import App from './App.vue'

axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
    // 其他代码
    store.commit('setLoading', true)

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
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

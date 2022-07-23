/* eslint-disable */
import { createApp } from 'vue'
import router from './router'
import store from './store'

import App from './App.vue'

const app = createApp(App)
// 没记错的话，Vue2中的Vue.的写法都变成了app.  之前是Vue.use(xxx)
app.use(router)
app.use(store)
app.mount('#app')

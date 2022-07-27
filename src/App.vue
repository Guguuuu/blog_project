<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <!-- 查看这个Loader，可以发现这个组件是被包裹在container中间的，这种结构看起来会比较奇怪，应该把这个loding这个盒子提升到外面去，因为他是一个全局的效果 -->
    <loader text="拼命加载中" background="rgba(0,0,0,0.8)"></loader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2022 知乎专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, computed } from 'vue'
import { useStore } from "vuex";
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    // 在App中为Loading添加一个简易的效果
    const isLoading = computed(() => store.state.loading)
    return {
      currentUser,
      isLoading
    }
  }
})
</script>

<style>
</style>
<template>
    <h1>
        <!-- 对于一个Object来说,如果想在页面中显示它所有内容，除了js的console.log 还可以用pre标签 -->
        <!-- pre标签可以定义预格式化的文本，在pre元素中，文本会保留空格、换行符，且文本显示等宽字体 -->
        <pre>{{ route }}</pre>
    </h1>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue";
//为了访问url的内容，需要一个钩子函数
import { useRoute } from "vue-router";
export default defineComponent({
    setup() {
        const route = useRoute()
        return {
            route
        }
    }
})
</script>

<style>
</style>
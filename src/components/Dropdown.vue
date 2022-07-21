<template>
    <div class="dropdown" ref="dropdownRef">
        <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
            {{ title }}
        </a>
        <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
            <slot></slot>
        </ul>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, watch } from "vue";
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
    name: 'Dropdown',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    setup() {
        const isOpen = ref(false)
        // 虽然Vue2中可以利用this.$ref拿到DOM节点，但Vue3的setup中用不了this，我们应该换一种方法
        const dropdownRef = ref<null | HTMLElement>(null)
        const toggleOpen = () => {
            isOpen.value = !isOpen.value
        }
        /* 
        const handler = (e: MouseEvent) => {
            // 然后呢，这个handler是一个独特的逻辑功能，我们可以提取到一个自定义hook函数中
            if (dropdownRef.value) { //能判断就说明dom节点挂载完成，dropdownRef的值已经是dom节点了
                if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
                    // contains返回的是布尔值，这里表示dropdownRef.value这个节点是否不包含当前鼠标事件对象的目标节点。并且这个isOpen是true的情况下,就让他为false。简而言之就是点击下拉菜单之外的地方就让下拉菜单隐藏起来。。
                    isOpen.value = false
                }
            }
        }
        onMounted(() => {
            document.addEventListener('click', handler)
        })
        onUnmounted(() => {
            document.removeEventListener('click', handler)
        })
         */
        const isClickOutside = useClickOutside(dropdownRef)
        watch(isClickOutside, () => {
            if (isOpen.value && isClickOutside.value) {
                isOpen.value = false
            }
        })
        return {
            isOpen,
            dropdownRef,//返回的时候，我们要做到返回的名字和外面ref属性的命名完全一样，当这个dom真正挂载的时候，我们就可以从这个dropdownRef.value里面拿到这个dom节点,由于这是一个ref生成的响应式数据，所以dropdownRef的值是会被从null更新成dom节点的
            toggleOpen
        }
    }
})

</script>

<style>
</style>
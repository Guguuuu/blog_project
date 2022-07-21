/* eslint-disable */
import { ref, onMounted, onUnmounted, Ref } from 'vue'

//第一步确定他要传入怎样的参数,这个参数类型就是刚刚写好的逻辑，鼠标放在dropdownRef上给你显式的类型
const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
    const isClickOutside = ref(false)
    const handler = (e: MouseEvent) => {
        if (elementRef.value) {
            if (elementRef.value.contains(e.target as HTMLElement)) {
                isClickOutside.value = false
            } else {
                isClickOutside.value = true
            }
        }
    }
    onMounted(() => {
        document.addEventListener('click', handler)
    })
    onUnmounted(() => {
        document.removeEventListener('click', handler)
    })
    return isClickOutside
}

export default useClickOutside
<template>
    <form class="validate-form-container">
        <slot name="default"></slot>
        <div class="submit-area" @click.prevent="submitForm">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">提交</button>
            </slot>
        </div>
    </form>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, onUnmounted } from "vue";
import mitt from 'mitt'
type ValidateFunc = () => boolean
type Events = {
    'form-item-created': ValidateFunc
}
// 由于$on等3个api已经被废弃，所以要借助外部的库
export const emitter = mitt<Events>() // 创建一个监听器
export default defineComponent({
    emits: ['form-submit'],
    setup(props, context) {
        // 这里面呢应该存放一系列函数，执行以后可以显式错误的信息，并且返回这个input是否通过
        let funcArr: ValidateFunc[] = []
        const submitForm = () => {
            // 在这个函数体内需要拿到最终的验证，并且触发事件，拿到内部validateinput的结果是一个难点，之后再说，这里先弄一个假的
            // 在submitForm中循环调用Validateinput中的方法并且返回所有结果的最终值,并通过事件发送出去
            // const result = funcArr.every(func => func()) every遇错会提前结束循环
            const result = funcArr.map(func => func()).every(result => result)
            context.emit('form-submit', result)
        }
        const callback = (func?: ValidateFunc) => {
            if (func) {
                funcArr.push(func)
            }
        }
        //添加到监听器中
        emitter.on('form-item-created', callback)
        onUnmounted(() => {
            emitter.off('form-item-created', callback)
            funcArr = []
        })
        return {
            submitForm
        }
    },
})
</script>
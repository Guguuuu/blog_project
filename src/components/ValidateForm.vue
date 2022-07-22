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
import { defineComponent } from "vue";
export default defineComponent({
    emits: ['form-submit'],
    setup(props, context) {
        const submitForm = () => {
            // 在这个函数体内需要拿到最终的验证，并且触发事件，拿到内部validateinput的结果是一个难点，之后再说，这里先弄一个假的
            context.emit('form-submit', true)
        }
        return {
            submitForm
        }
    }
})
</script>
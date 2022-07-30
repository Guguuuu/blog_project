<template>
    <div class="validate-input-container pb-3">
        <input v-if="tag !== 'textarea'" class="form-control" :class="{ 'is-invalid': inputRef.error }"
            :value="inputRef.val" @blur="validateInput" @input="updateValue" v-bind="$attrs">
        <textarea v-else class="form-control" :class="{ 'is-invalid': inputRef.error }" :value="inputRef.val"
            @blur="validateInput" @input="updateValue" v-bind="$attrs">
    </textarea>
        <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, reactive, PropType, onMounted } from "vue";
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
    type: 'required' | 'email' | 'custom';
    message: string;
    validator?: () => boolean;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
    name: 'ValidateInput',
    props: {
        rules: Array as PropType<RulesProp>,
        // 想要在自定义组件支持v-model其实就是两步走(Vue3)，1. 创建一个称之为modelValue的Props
        modelValue: String,
        tag: {
            type: String as PropType<TagType>,
            default: 'input'
        }
    },
    inheritAttrs: false, //我不希望组件的根元素继承attribute
    setup(props, context) {
        const inputRef = reactive({
            val: props.modelValue || '',
            error: false,
            message: ''
        })
        // 自定义组件v-model的改造
        // 2. 更新值的时候，需要触发一个事件，事件的名称是'update:modelValue',这样就可以实现v-model的功能了
        const updateValue = (e: Event) => {
            const targetValue = (e.target as HTMLInputElement).value
            inputRef.val = targetValue
            context.emit('update:modelValue', targetValue)
        }
        const validateInput = () => {
            if (props.rules) {
                const allPassed = props.rules.every(rule => {
                    let passed = true
                    inputRef.message = rule.message
                    switch (rule.type) {
                        case 'required':
                            passed = (inputRef.val.trim() !== '')
                            break
                        case 'email':
                            passed = emailReg.test(inputRef.val)
                            break
                        case 'custom':
                            passed = rule.validator ? rule.validator() : true
                            break
                        default:
                            break
                    }
                    return passed
                })
                inputRef.error = !allPassed
                return allPassed
            }
            return true
        }
        onMounted(() => {
            emitter.emit('form-item-created', validateInput)
        })
        return {
            inputRef,
            validateInput,
            updateValue
        }
    }
})
</script>


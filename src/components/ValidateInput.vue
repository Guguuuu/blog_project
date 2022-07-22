<template>
    <div class="validate-input-container pb-3">
        <input type="text" class="form-control" :class="{ 'is-invalid': inputRef.error }" v-model="inputRef.val"
            @blur="validateInput">
        <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, reactive, PropType } from "vue";
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
interface RuleProp {
    type: 'required' | 'email';
    message: string;
}
export type RulesProp = RuleProp[]
export default defineComponent({
    name: 'ValidateInput',
    props: {
        rules: Array as PropType<RulesProp>
    },
    setup(props) {
        const inputRef = reactive({
            val: '',
            error: false,
            message: ''
        })
        const validateInput = () => {
            if (props.rules) {
                // 循环验证对应的规则,每一个rule都要通过，但凡有一个不通过都会被视为错误
                const allPassed = props.rules.every(rule => {
                    // every方法返回一个布尔值，每一项都为true的时候，它才为true，有一项为false，整个都为false，并且呢有一项为false的时候，就会立即停止循环直接返回，艹，原来如此，懂了
                    let passed = true // 每个rule的临时变量
                    inputRef.message = rule.message
                    switch (rule.type) {
                        case 'required':
                            passed = (inputRef.val.trim() !== '')
                            break
                        case 'email':
                            passed = emailReg.test(inputRef.val)
                            break
                        default:
                            break
                        //就是多个规则，去匹配一个input输入的值。当我输入为空的时候，every遍历到第一条规则，发现为空，然后直接返回false，不再继续遍历。然后显式span。当我输入abc的时候，能通过第一条规则，因为不为空，但不通过正则的匹配，因为不是正规的邮箱格式，这时候也返回false，直接跳出every循环，显式span盒子(显式inputRef.message)。当我输入正确的格式，every遍历每一条规则都通过，才返回true
                    }
                    return passed
                })
                inputRef.error = !allPassed
            }
        }
        return {
            inputRef,
            validateInput
        }
    }
})
</script>


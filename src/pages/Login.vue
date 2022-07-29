<template>
    <div class="login-page">
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">邮箱地址</label>
                <validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text"
                    ref="inputRef" />
            </div>
            <div class="mb-3">
                <label class="form-label">密码</label>
                <validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
            </div>
        </validate-form>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref } from 'vue'
//登录成功，我们想要跳转到首页，这时候需要用到vue-router的另外一个钩子
//与useRoute不一样，useRoute用于获取路由的信息。useRouter用于定义路由的一系列行为
//可以调用 用于跳转到另外一个url
import { useStore } from "vuex";
import { useRouter } from 'vue-router'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
    name: 'Login',
    components: {
        ValidateInput,
        ValidateForm
    },
    setup() {
        const emailVal = ref('')
        const router = useRouter()
        const store = useStore()
        const emailRules: RulesProp = [
            { type: 'required', message: '电子邮箱地址不能为空' },
            { type: 'email', message: '请输入正确的电子邮箱格式' }
        ]
        const passwordVal = ref('')
        const passwordRules: RulesProp = [
            { type: 'required', message: '密码不能为空' }
        ]
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const payload = {
                    email: emailVal.value,
                    password: passwordVal.value
                }
                store.dispatch('loginAndFetch', payload).then(data => {
                    createMessage('登录成功！', 'success')
                    setTimeout(() => {
                        router.push('/')
                    }, 1000)
                }).catch(e => {
                    // 由于是点击登录触发的，所以异常要在这里捕获
                    console.log(e);
                })
            }
        }
        return {
            emailRules,
            emailVal,
            passwordVal,
            passwordRules,
            onFormSubmit
        }
    }
})
</script>
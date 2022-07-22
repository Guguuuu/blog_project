<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" ref="inputRef" />
        <!-- 有时候我们需要在js中直接访问一个子组件，为了达到这个目的，你可以通过ref这个attribute为子组件赋予一个ID引用 -->
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
      </div>
      <template #submit>
        <!-- v-slot:submit可以被缩写为 #submit -->
        <span class="btn btn-danger">Submit</span>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList from './components/ColumnList.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'
import ValidateForm from './components/ValidateForm.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import { testData } from './testData'
const currentUser: UserProps = {
  isLogin: true,
  name: 'viking'
}
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
    ValidateInput,
    ValidateForm
  },
  setup() {
    const inputRef = ref<any>()
    const emailVal = ref('123@qq.com')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordVal = ref('123')
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]

    // 创建一个函数来监听结果
    const onFormSubmit = (result: boolean) => {
      console.log('result', result);
      //尝试在点击form组件的提交按钮时触发app中的自定义事件进而触发我们通过ref拿到的组件实例中的方法。经过实验，确实在父组件中拿到了子组件的验证结果
    }
    return {
      list: testData,
      currentUser,
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      inputRef,
      onFormSubmit
    }
  }
})
</script>

<style>
</style>
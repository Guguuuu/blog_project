<template>
    <div class="create-post-page">
        <h4>新建文章</h4>
        <input type="file" name="file" @change.prevent="handleFileChange">
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题：</label>
                <validate-input :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情：</label>
                <validate-input rows="10" type="text" tag="textarea" placeholder="请输入文章详情" :rules="contentRules"
                    v-model="contentVal" />
            </div>
            <template #submit>
                <button class="btn btn-primary btn-large">发表文章</button>
            </template>
        </validate-form>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { GlobalDataProps, PostProps } from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'

export default defineComponent({
    name: 'Login',
    components: {
        ValidateInput,
        ValidateForm
    },
    setup() {
        const titleVal = ref('')
        const router = useRouter()
        const store = useStore<GlobalDataProps>()
        const titleRules: RulesProp = [
            { type: 'required', message: '文章标题不能为空' }
        ]
        const contentVal = ref('')
        const contentRules: RulesProp = [
            { type: 'required', message: '文章详情不能为空' }
        ]
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const { column } = store.state.user
                if (column) {
                    const newPost: PostProps = {
                        // 转成 string 类型
                        _id: new Date().getTime().toString(),
                        title: titleVal.value,
                        content: contentVal.value,
                        // 转成 string 类型
                        column: column.toString(),
                        createdAt: new Date().toLocaleString()
                    }
                    store.commit('createPost', newPost)
                    router.push({ name: 'column', params: { id: column } })
                }
            }
        }
        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement
            // files是一个FileList类型，他是一个对象，不是数组，他支持选择多个文件，所以可能有多个
            const files = target.files
            if (files) {
                // 我们只选择一个文件，那就拿他的第一项即可
                const uploadFile = files[0]
                // 利用formData模拟表单数据
                const formData = new FormData()
                formData.append(uploadFile.name, uploadFile)
                //下面第三个参数，是添加一个额外的header，为了传文件，我们写成下面这样
                axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((resp: any) => {
                    console.log(resp)
                    // 请求成功之后，对象中会看到我们的文件上传到阿里oss的一个地址，复制打开就能看到我们的文件
                })
            }
        }
        return {
            titleRules,
            titleVal,
            contentVal,
            contentRules,
            onFormSubmit,
            handleFileChange
        }
    }
})
</script>
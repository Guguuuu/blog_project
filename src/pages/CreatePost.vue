<template>
    <div class="create-post-page container">
        <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
        <uploader action="/upload" :beforeUpload="commonUploadCheck" @file-uploaded="handleFileUploaded"
            :uploaded="uploadedData"
            class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4">
            <h2>点击上传头图</h2>
            <template #loading>
                <div class="d-flex">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h2>正在上传</h2>
                </div>
            </template>
            <template #uploaded="dataProps">
                <img :src="dataProps.uploadedData.data.url">
            </template>
        </uploader>
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">文章标题：</label>
                <validate-input :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">文章详情：</label>
                <editor v-model="contentVal" :options="editorOptions" @blur="checkEditor" ref="editorRef"
                    :class="{ 'is-invalid': !editorStatus.isValid }"></editor>
                <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{ editorStatus.message }}</span>
            </div>
            <template #submit>
                <button class="btn btn-primary btn-large">{{ isEditMode ? '更新文章' : '发表文章' }}</button>
            </template>
        </validate-form>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import EasyMDE, { Options } from 'easymde'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Uploader from '../components/Uploader.vue'
import Editor from '../components/Editor.vue'
import createMessage from '../components/createMessage'
import { commonUploadCheck } from '../helper'
interface EditorInstance {
    clear: () => void;
    getMDEInstance: () => EasyMDE | null
}
export default defineComponent({
    name: 'Login',
    components: {
        ValidateInput,
        ValidateForm,
        Uploader,
        Editor
    },
    setup() {
        const uploadedData = ref()
        const titleVal = ref('')
        const editorStatus = reactive({
            isValid: true,
            message: ''
        })
        const router = useRouter()
        const route = useRoute()
        // 利用这个变量来判断是否是编辑模式
        const isEditMode = !!route.query.id//利用!!转换成布尔类型，如果route.query.id存在为true
        const store = useStore<GlobalDataProps>()
        const editorRef = ref<null | EditorInstance>()
        let imageId = ''
        const editorOptions: Options = {
            spellChecker: false // 拼写检查设置成false
        }
        const titleRules: RulesProp = [
            { type: 'required', message: '文章标题不能为空' }
        ]
        const contentVal = ref('')
        // const contentRules: RulesProp = [
        //     { type: 'required', message: '文章详情不能为空' }
        // ]
        const checkEditor = () => {
            if (contentVal.value.trim() === '') {
                editorStatus.isValid = false
                editorStatus.message = '文章详情不能为空'
            } else {
                editorStatus.isValid = true
                editorStatus.message = ''
            }
        }
        onMounted(() => {

            if (isEditMode) {//即，我是否是点击编辑按钮进来的
                store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
                    const currentPost = rawData.data
                    if (currentPost.image) {
                        uploadedData.value = { data: currentPost.image }
                    }
                    titleVal.value = currentPost.title
                    contentVal.value = currentPost.content || ''
                })
            }
        })
        const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
            if (rawData.data._id) {
                imageId = rawData.data._id
            }
        }
        const onFormSubmit = (result: boolean) => {
            checkEditor()
            if (result && editorStatus.isValid) {
                const { column, _id } = store.state.user
                if (column) {
                    const newPost: PostProps = {
                        title: titleVal.value,
                        content: contentVal.value,
                        column,
                        author: _id,
                    }
                    if (imageId) {
                        newPost.image = imageId
                    }
                    const actionName = isEditMode ? 'updatePost' : 'createPost'
                    const sendData = isEditMode ? {
                        id: route.query.id,
                        payload: newPost
                    } : newPost
                    store.dispatch(actionName, sendData).then(() => {
                        createMessage('发表成功，准备跳转到文章', 'success', 1000)
                        setTimeout(() => {
                            router.push({ name: 'column', params: { id: column } })
                        }, 1000)
                    })
                }
            }
        }

        return {
            titleRules,
            titleVal,
            contentVal,
            // contentRules,
            uploadedData,
            isEditMode,
            editorOptions,
            editorRef,
            editorStatus,
            onFormSubmit,
            commonUploadCheck,
            handleFileUploaded,
            checkEditor
        }
    }
})
</script>

<style>
.create-post-page .file-upload-container {
    height: 200px;
    cursor: pointer;
}

.create-post-page .file-upload-container img {
    width: 100%;
    height: 100%;
    /* object-fir属性指定可替换元素的内容应该如何适应到其使用的高度和宽度确定的框,这个属性支持响应式 */
    object-fit: cover;
}
</style>
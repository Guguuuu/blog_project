<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="file-upload">
        <div class="file-upload-container" @click.prevent="triggerUpload">
            <slot v-if="fileStatus === 'loading'" name="loading">
                <button class="btn btn-primary" disabled>正在上传...</button>
            </slot>
            <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uoloadedData">
                <button class="btn btn-primary">上传成功</button>
            </slot>
            <slot v-else name="default">
                <button class="btn btn-primary">点击上传</button>
            </slot>
        </div>
        <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
        <!-- 把input框隐藏，去实现点击button，触发隐藏的这个input一次upload的过程 -->
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, PropType, ref } from "vue";
import axios from 'axios'
//我们需要根据上传的不同状态展现不同的元素，需要一个字段来指示状态
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
    //添加一个actions，是post请求发送的地址
    props: {
        action: {
            type: String,
            required: true
        },
        beforeUpload: {
            type: Function as PropType<CheckFunction>
        }
    },
    emits: ['file-uploaded', 'file-uploaded-error'],
    setup(props, context) {
        const fileInput = ref<null | HTMLInputElement>(null)
        const fileStatus = ref<UploadStatus>('ready')
        const uoloadedData = ref()
        const triggerUpload = () => {
            if (fileInput.value) {
                fileInput.value.click()
            }
        }
        const handleFileChange = (e: Event) => {
            const currentTarget = e.target as HTMLInputElement
            if (currentTarget.files) {
                //能进来说明此时已经选择了文件准备上传了

                const files = Array.from(currentTarget.files)//files不是数组，可以先转换成数组
                //我们应该在loading之前检查是否满足这个用户自定义的一些需求
                if (props.beforeUpload) {
                    const result = props.beforeUpload(files[0])
                    if (!result) {
                        return
                    }
                }
                fileStatus.value = 'loading'//有了不同的状态就能把界面改一下了
                const formData = new FormData()
                formData.append('file', files[0]) // 拿files数组中的第一项，即第一个文件
                axios.post(props.action, formData, {
                    // 第三个参数，是添加一个额外的header，目的是为了传文件
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(resp => {
                    fileStatus.value = 'success'
                    // console.log(resp.data); 根据响应数据的结构，我在store定义了ResponseType类型，以便让'file-uploaded'所对应的回调的参数设置成ResponseType类型获得更好的TS支持
                    uoloadedData.value = resp.data
                    context.emit('file-uploaded', resp.data)
                }).catch((error) => {
                    fileStatus.value = 'error'
                    context.emit('file-uploaded-error', { error })
                }).finally(() => {
                    if (fileInput.value) {// 这时候拿到的是DOM节点
                        //将DOM节点的值设置为空
                        fileInput.value.value = ''
                    }
                })
            }
        }
        return {
            fileInput,
            fileStatus,
            uoloadedData,
            triggerUpload,
            handleFileChange
        }
    }
})
</script>


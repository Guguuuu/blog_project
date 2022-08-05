<template>
    <div class="post-detail-page w-690">
        <modal title="删除文章" :visible="modalIsVisible" @modal-on-close="modalIsVisible = false"
            @modal-on-confirm="hideAndDelete">
            <p>确定要删除这篇文章吗 ?</p>
        </modal>
        <article class="mb-5 pb-3" v-if="currentPost">
            <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4"
                v-if="currentImageUrl">
            <h2 class="mb-4">{{ currentPost.title }}</h2>
            <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
                <div class="col">
                    <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'">
                    </user-profile>
                </div>
                <span class="text-muted col text-right font-italic">发表于：{{ currentPost.createdAt }}</span>
            </div>
            <div v-html="currentHTML"></div>
            <div v-if="showEditArea" class="btn-group mt-5">
                <router-link :to="{ name: 'create', query: { id: currentPost._id } }" type="button"
                    class="btn btn-success">编辑
                </router-link>
                <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
            </div>
        </article>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, onMounted, computed, ref } from 'vue'
import { marked } from 'marked'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, PostProps, ImageProps, UserProps, ResponseType } from '../store'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
    name: 'post-detail',
    components: {
        UserProfile,
        Modal
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        const route = useRoute()
        const router = useRouter()
        const modalIsVisible = ref(false)
        // 当前这篇文章的id
        const currentId = route.params.id
        onMounted(() => {
            store.dispatch('fetchPost', currentId)
        })
        const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
        const currentHTML = computed(() => {
            if (currentPost.value && currentPost.value.content) {
                //调用markdown-it上面的方法，把用户输入的markdown格式转换成HTML格式
                return marked.parse(currentPost.value.content)
            }
        })
        const showEditArea = computed(() => {
            const { isLogin, _id } = store.state.user
            //currentPost是一个ComputedRefImpl对象，需要.value才能拿到值，类似ref
            if (currentPost.value && currentPost.value.author && isLogin) {
                //先判断currentPost.value是否存在，再判断作者存不存在，最后判断是否登录
                const postAuthor = currentPost.value.author as UserProps
                return postAuthor._id === _id//判断这篇文章的作者id是否等于登录的人的id
            } else {
                return false
            }
        })
        const currentImageUrl = computed(() => {
            if (currentPost.value && currentPost.value.image) {
                const { image } = currentPost.value
                return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
            } else {
                return null
            }
        })
        const hideAndDelete = () => {
            modalIsVisible.value = false
            store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
                createMessage('删除成功！', 'success', 1000)
                setTimeout(() => {
                    router.push({ name: 'column', params: { id: rawData.data.column } })
                }, 1000)
            })
        }
        return {
            currentPost,
            currentImageUrl,
            currentHTML,
            showEditArea,
            modalIsVisible,
            hideAndDelete
        }
    }
})
</script>

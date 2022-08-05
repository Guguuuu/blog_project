/* eslint-disable */
import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'

export interface ResponseType<P = {}> {
    code: number;
    msg: string;
    data: P;
}
export interface UserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    email?: string;
    avatar?: ImageProps;
    description?: string;
}
export interface ImageProps {
    _id?: string;
    url?: string;
    createdAt?: string;
    fitUrl?: string;
}
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}
export interface PostProps {
    _id?: string;
    title: string;
    excerpt?: string;
    content: string;
    image?: ImageProps | string;
    createdAt?: string;
    column: string;
    author?: string | UserProps;
}
export interface GlobalErrorProps {
    status: boolean;
    message?: string;
}
export interface GlobalDataProps {
    error: GlobalErrorProps;
    token: string;
    loading: boolean;
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
    const { data } = await axios(url, config)
    commit(mutationName, data)
    return data
}
const store = createStore<GlobalDataProps>({
    state: {
        error: { status: false },
        token: localStorage.getItem('token') || '',
        loading: false,
        columns: [],
        posts: [],
        user: { isLogin: false }
    },
    mutations: {
        createPost(state, newPost) {
            state.posts.push(newPost)
        },
        fetchColumns(state, rawData) {
            state.columns = rawData.data.list
        },
        fetchColumn(state, rawData) {
            state.columns = [rawData.data]
        },
        updateColumn(state, rawData) {
            state.columns = [rawData.data]
        },
        fetchPosts(state, rawData) {
            state.posts = rawData.data.list
        },
        fetchPost(state, rawData) {
            state.posts = [rawData.data]
        },
        deletePost(state, { data }) {
            state.posts = state.posts.filter(post => post._id !== data._id)
        },
        updatePost(state, { data }) {
            state.posts = state.posts.map(post => {
                if (post._id === data._id) {
                    return data
                } else {
                    return post
                }
            })
        },
        setLoading(state, status) {
            state.loading = status
        },
        setError(state, e: GlobalErrorProps) {
            state.error = e
        },
        fetchCurrentUser(state, rawData) {
            state.user = { isLogin: true, ...rawData.data }
        },
        login(state, rawData) {
            const { token } = rawData.data
            state.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common.Authorization = `Bearer ${token}`// 固定写法
        },
        updateUser(state, { data }) {
            state.user = { isLogin: true, ...data }
        },
        logout(state) {
            state.token = ''
            state.user = { isLogin: false }
            localStorage.removeItem('token')
            delete axios.defaults.headers.common.Authorization
        }
    },
    actions: {
        fetchColumns({ commit }) {
            return asyncAndCommit('/columns?pageSize=12', 'fetchColumns', commit)
        },
        fetchColumn({ commit }, cid) {
            return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
        },
        fetchPosts({ commit }, cid) {
            return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
        },
        fetchPost({ commit }, id) {
            return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
        },
        updatePost({ commit }, { id, payload }) {
            return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
                method: 'patch',
                data: payload
            })
        },
        fetchCurrentUser({ commit }) {
            return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        login({ commit }, payload) {
            return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload })
        },
        createPost({ commit }, payload) {
            return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload })
        },
        deletePost({ commit }, id) {
            return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
        },
        updateColumn({ commit }, { id, payload }) {
            return asyncAndCommit(`/columns/${id}`, 'updateColumn', commit, { method: 'patch', data: payload })
        },
        updateUser({ commit }, { id, payload }) {
            return asyncAndCommit(`/user/${id}`, 'updateUser', commit, { method: 'patch', data: payload })
        },
        loginAndFetch({ dispatch }, loginData) {
            return dispatch('login', loginData).then(() => {
                return dispatch('fetchCurrentUser')
            })
        }
    },
    getters: {
        getColumnById: (state) => (id: string) => {
            return state.columns.find(c => c._id === id)
            // find方法对数组中的每个元素执行callback函数,并返回true的第一个元素值。
            // find不会改变原数组
        },
        getPostsByCid: (state) => (cid: string) => {
            return state.posts.filter(post => post.column === cid)
            //filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。
        },
        getCurrentPost: (state) => (id: string) => {
            return state.posts.find(post => post._id === id)
        }
    }
})

export default store

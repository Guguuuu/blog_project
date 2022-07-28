/* eslint-disable */
import { createStore, Commit } from 'vuex'
import axios from 'axios'

interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number;
    columnId?: number;
}
interface ImageProps {
    _id?: string;
    url?: string;
    createdAt?: string;
}
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}
export interface PostProps {
    _id: string;
    title: string;
    excerpt?: string;
    content: string;
    image?: ImageProps;
    createdAt: string;
    column: string;
}
export interface GlobalDataProps {
    token: string;
    loading: boolean;
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    const { data } = await axios.get(url)
    commit(mutationName, data)
}
/* 之前几次的提交，主要是在获取数据上下功夫，到目前为止，我们已经能获取首页和详情页的数据了
现在我们将注意力转移到权限管理上，即处理用户注册登录等一系列行为，这个过程中呢，会接触到比如
vuex如何发送post请求、token是什么、jwt的工作原理、jwt和session的区别 
spa中如何持久化获取用户的状态、针对不同请求的权限管理 怎样显示全局数据提示
这些也是SPA中的一大块核心内容。

这节完成 --- 登录
登录的过程中呢，就是一个发送post请求的过程，在这个过程中呢，需要在body中传入含有email：string和password：string的数据
在用户名密码匹配的情况下，后端会创建一个持久化的会话，然后将一个特别的标识符token传回给前端
这个标识符就是每次请求的特殊钥匙，有了这个东西就代表着你是一个已经经过验证的身份
这个token字段是一大窜看似随机的字符串，这就是我们的神秘令牌，登录的身份象征。token中不包含任何的用户信息，即其他的用户信息我们需要通过这个令牌去获取
👇 */
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await axios.post(url, payload)
    commit(mutationName, data)
    return data
}
const store = createStore<GlobalDataProps>({
    state: {
        token: '',
        loading: false,
        columns: [],
        posts: [],
        user: { isLogin: false, name: 'Guguuuu', columnId: 1 }
    },
    mutations: {
        // login(state) {
        //     state.user = { ...state.user, isLogin: true, name: 'viking' }
        // },
        createPost(state, newPost) {
            state.posts.push(newPost)
        },
        fetchColumns(state, rawData) {
            state.columns = rawData.data.list
        },
        fetchColumn(state, rawData) {
            state.columns = [rawData.data]
        },
        fetchPost(state, rawData) {
            state.posts = rawData.data.list
        },
        setLoading(state, status) {
            state.loading = status
        },
        login(state, rawData) {
            // 把actions获取返回的token赋值到store上面
            state.token = rawData.data.token
        }
    },
    actions: {
        fetchColumns({ commit }) {
            getAndCommit('/columns', 'fetchColumns', commit)
        },
        fetchColumn({ commit }, cid) {
            getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
        },
        fetchPost({ commit }, cid) {
            getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
        },
        login({ commit }, payload) {
            return postAndCommit('/user/login', 'login', commit, payload)
        }
    },
    getters: {
        getColumnById: (state) => (id: string) => {
            return state.columns.find(c => c._id === id)
        },
        getPostsByCid: (state) => (cid: string) => {
            return state.posts.filter(post => post.column === cid)
        }
    }
})

export default store

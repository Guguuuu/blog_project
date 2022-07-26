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
    loading: boolean;
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}
// 2.
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    // 发送请求之前和请求之后，触发这个mutation中修改loading状态的方法
    // commit('setLoading', true)
    const { data } = await axios.get(url)
    commit(mutationName, data)
    // commit('setLoading', false) 配置了拦截器之后这里就可以不用这样写了
}
const store = createStore<GlobalDataProps>({
    state: {
        /* 3. 刚刚我们用async和await完成了异步请求的改造
            然后我们发送异步请求的时候，最好给用户一个提示，告诉用户现在数据在读取中
            请耐心等候，这就是一个经典的loading问题
            这个loading显然是一个全局的状态，提到全局的状态自然而然的想到了这个store*/
        loading: false,
        columns: [],
        posts: [],
        user: { isLogin: true, name: 'Guguuuu', columnId: 1 }
    },
    mutations: {
        login(state) {
            state.user = { ...state.user, isLogin: true, name: 'viking' }
        },
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
        }
    },
    actions: {
        // 1.然后可以发现下面的代码形式有点重复，我们可以加以改造，考虑把他们提取出来做一个单独的函数
        fetchColumns({ commit }) {
            getAndCommit('/columns', 'fetchColumns', commit)
        },
        fetchColumn({ commit }, cid) {
            getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
        },
        fetchPost({ commit }, cid) {
            getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
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

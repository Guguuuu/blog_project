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
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}
// 2.
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    // 利用async 和 await 让异步代码看起来和同步代码很像
    const { data } = await axios.get(url)
    commit(mutationName, data)
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: [],
        posts: [],
        user: { isLogin: true, name: 'viking', columnId: 1 }
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

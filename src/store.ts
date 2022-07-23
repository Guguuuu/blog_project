/* eslint-disable */
import { createStore } from "vuex";
import { testData, testPosts, ColumnProps, PostProps } from "./testData";
interface UserProps {
    isLogin: boolean;
    name?: string;
    id?: number;
}
export interface GlobalDataProps {
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps
}
const store = createStore<GlobalDataProps>({
    state: {
        columns: testData,
        posts: testPosts,
        user: { isLogin: false }
    },
    mutations: {
        login(state) {
            //使用新对象替换老对象，用扩展运算符
            state.user = { ...state.user, isLogin: true, name: 'Guguuuu' }
        }
    }
})

export default store
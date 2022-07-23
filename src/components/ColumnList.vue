<template>
    <div class="row">
        <div v-for="column in columnList" :key="column.id" class="col-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body text-center">
                    <img :src="column.avatar" :alt="column.title" class="rounded-circle border border-light w-25 my-3">
                    <h5 class="card-title">{{ column.title }}</h5>
                    <p class="card-text text-left">{{ column.description }}</p>
                    <router-link :to="`/column/${column.id}`" class="btn btn-outline-primary">进入专栏</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { computed, defineComponent, PropType } from 'vue';
export interface ColumnProps {
    id: number;
    title: string;
    avatar?: string;
    description: string;
}
export default defineComponent({
    name: 'ColumnList',
    props: {
        list: {
            // type: Array as ColumnProps[],
            type: Array as PropType<ColumnProps[]>,
            // 我们并不能直接使用类型断言，把这个类型断言为ColumnProps的数组。因为Array是一个数组的构造函数，它不是一个类型，没法把它断言成一个类型，为了解决这个问题，Vue在2的时候就推出了一个解决方法，叫PropType，它接收一个泛型，可以将一个Array构造函数返回传入的泛型类型。如果想把一个构造函数断言成类型，你需要使用PropType。使用这样的断言的好处就是，你可以在模板或者setup中获取到类型。比如在setup里直接 props. 就会出现list的类型提示

            /* 用一句简单的话来说，就是为了类型推论，让我们在 使用属性的时候获取更丰富的类型提示，比如在这里我们定义了一个属性 list，使用 vue 默认的 Array，只能确定它是一个数组类型，不能确定数组里面的每一项到底是什么样子的。
            你在 setup 中，看 props.list 就是一个any数组，但是如果使用  PropType<ColumnProps[]> 这个时候，props.list 就变成一个 ColumnProps 的数组，你使用它的时候不论在 ts 中还是模版中都能获得类型的推断和自动补全等等。 */
            required: true,
        }
    },
    setup(props) {
        const columnList = computed(() => {
            return props.list.map(column => {
                if (!column.avatar) {
                    column.avatar = require('@/assets/column.jpg')
                }
                return column
            })
        })
        return {
            columnList
        }
    }
})

</script>

<style>
</style>

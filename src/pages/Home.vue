<template>
    <div class="home-page container-md">
        <section class="py-5 text-center container">
            <div class="row py-lg-5">
                <div class="col-lg-6 col-md-8 mx-auto">
                    <img src="../assets/callout.svg" alt="callout" class="w-50" />
                    <h2 class="font-weight-light">随心写作，自由表达</h2>
                    <p>
                        <router-link to="/create" class="btn bg-dark my-2" style="color:#fff">开始写文章</router-link>
                    </p>
                </div>
            </div>
        </section>
        <h4 class="font-weight-bold text-center">发现精彩</h4>
        <column-list :list="list"></column-list>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import ColumnList from '../components/ColumnList.vue'
import Uploader from '../components/Uploader.vue';

export default defineComponent({
    name: 'Home',
    components: {
        ColumnList,
        Uploader
    },
    setup() {
        const store = useStore<GlobalDataProps>()
        onMounted(() => {
            store.dispatch('fetchColumns')
        })
        const list = computed(() => store.state.columns) 
        return {
            list,
        }
    }
})
</script>

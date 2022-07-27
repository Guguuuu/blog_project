<template>
    <teleport to="#back">
        <!-- 2.但是呢，通过teleport在html中加上一个div并不是一个良好的设计，所以我们想使用另外一种方法来实现对应的功能。我们需要在body中创建一个最顶层的div。我们可以在组件还没完全挂载到DOM之前，手动创建一个div，然后把这个div的id设置成back就可以了。在生命周期中，setup的执行比beforecreate还要早，所以我们可以在setup中创建DOM节点 -->
        <div class="d-flex justify-content-center align-items-center h-100 loading-container"
            :style="{ backgroundColor: background || '' }">
            <div class="loading-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">{{ text || 'Loading...' }}</span>
                </div>
                <p v-if="text" class="text-primary small">{{ text }}</p>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, onUnmounted } from 'vue';

export default defineComponent({
    name: 'Loader',
    props: {
        // 这里面就是CSS的取值而已
        text: {
            type: String
        },
        background: {
            type: String
        }
    },
    setup() {
        const node = document.createElement('div')
        node.id = 'back'
        document.body.appendChild(node)
        onUnmounted(() => {
            // 每次加载完成就把动态创建的用来展示loading的节点删除掉
            document.body.removeChild(node)
        })
    }
})
</script>

<style>
/* 我们要把loading-container这个div盒子做成长宽都是100%，且position为fixed的遮罩层 */
.loading-container {
    background: rgba(255, 255, 255, .5);
    z-index: 100;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.loading-container {
    text-align: center;
}
</style>
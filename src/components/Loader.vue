<template>
    <div class="d-flex justify-content-center align-items-center h-100 loading-container"
        :style="{ backgroundColor: background || '' }">
        <div class="loading-content">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ text || 'Loading...' }}</span>
            </div>
            <p v-if="text" class="text-primary small">{{ text }}</p>
        </div>
    </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from 'vue';

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
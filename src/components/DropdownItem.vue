<template>
    <li class="dropdown-option" :class="{ 'is-disabled': disabled }">
        <slot></slot>
    </li>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent } from "vue";
export default defineComponent({
    name: 'DropdownItem',
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    }
})

</script>

<style>
/* 同时是dropdown-option类和is-disabled类 下的所有元素 */
.dropdown-option.is-disabled * {
    color: #6c757d;
    /* 去掉鼠标事件 */
    pointer-events: none;
    background-color: transparent;
}
</style>
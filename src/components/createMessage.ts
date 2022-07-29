/* eslint-disable */
import { createApp } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout = 2000) => {
    // 这里的难点是怎样用函数的形式去创建一个组件，因为之前都是在组件的template实例化一个组件的
    // 参考main.ts中createApp方法，他能生成一个组件的实例。第一个参数接收组件，第二接收props
    const messageInstance = createApp(Message, {
        message,
        type
    })
    // 创建完这个组件的实例对象之后，我们需要把他挂载到一个节点上
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    messageInstance.mount(mountNode)
    setTimeout(() => {
        messageInstance.unmount()
        document.body.removeChild(mountNode)
    }, timeout)
}

export default createMessage
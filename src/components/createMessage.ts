/* eslint-disable */
import { h, render } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout?: number) => {
    const messageVnode = h(Message, {
        message,
        type
    })
    const mountNode = document.createElement('div')
    document.body.appendChild(mountNode)
    // 挂载到节点，这里换成render方法
    render(messageVnode, mountNode)
    // 添加一个手动清除Message组件的方法
    const destory = () => {
        render(null, mountNode)
        document.body.removeChild(mountNode)
    }
    if (timeout) {
        setTimeout(() => {
            destory()
        }, timeout)
    }
    //返回这个方法，也就是这个实例上包裹对应的方法
    return {
        destory
    }
}

export default createMessage
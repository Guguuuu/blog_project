/* eslint-disable */
import { ColumnProps, ImageProps, UserProps } from './store'
import createMessage from './components/createMessage'

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
    if (data && data.url) {
        //上面这种写法就是先判断data为不为空，为空则逻辑中断，不为空再判断data中的url为不为空,能进行下去说明都不为空
        const formatStr = format.reduce((prev, current) => {
            //reduce() 方法接收一个函数作为累加器,数组中的每个值(从左到右)开始缩减,最终计算为一个值。
            //reduce()中的参数函数接收4个参数，第一个prev是函数计算结束后返回的值，current是当前元素
            return current + ',' + prev
        }, '')
        data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
    }
}

export const commonUploadCheck = (file: File) => {
    const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
    const { passed, error } = result
    if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
    }
    if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb', 'error')
    }
    return passed
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
    if (data.avatar) {
        generateFitUrl(data.avatar, width, height)
        //假如有值，就给他处理一下，多添加一个 fitUrl
    } else {
        //，没有就用本地的默认图片。
        const parseCol = data as ColumnProps
        data.avatar = {
            // 这里呢，ColumnProps数据类型和UserProps数据类型的区别在于前者具有title属性，所以利用这个来判断是ColumnProps数据类型还是UserProps数据类型依次添加对应的默认头图
            fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
        }
    }
}

interface CheckCondition {
    format?: string[]; //检查是什么格式 jpg？png？
    size?: number;
}
type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: CheckCondition) {
    const { format, size } = condition
    const isValidFormat = format ? format.includes(file.type) : true
    const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
    let error: ErrorType = null
    if (!isValidFormat) {
        error = 'format'
    }
    if (!isValidSize) {
        error = 'size'
    }
    return {
        passed: isValidFormat && isValidSize,
        error
    }
}

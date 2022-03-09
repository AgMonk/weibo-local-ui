// 请求工具

import {ElMessage} from "element-plus";

export const autoRetry = (reason, method) => {
    const {message, status,} = reason
    const m = `${status}: ${message}`
    if (message.startsWith('timeout of')) {
        ElMessage.info("请求超时，稍后自动重试")
        setTimeout(() => method(), 3000)
    } else {
        console.log(m)
        ElMessage.error(m)
        throw reason
    }
}
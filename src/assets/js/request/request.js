import axios from "axios";

export const wbGetRequest = axios.create({
    baseURL: "/wb-api/",
    timeout: 20000,
    method: "get",
    validateStatus,
    headers: {}
})

export const weiboPostRequest = axios.create({
    baseURL: "/wb-api/",
    timeout: 20000,
    method: "post",
    validateStatus,
})


wbGetRequest.interceptors.response.use(onFulfilled, onRejected);
weiboPostRequest.interceptors.response.use(onFulfilled, onRejected);

function onRejected(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
}

function onFulfilled(res) {
    // 在发送请求之前做些什么
    const {data, status, config} = res
    const {message} = data;
    const {url} = config
    if (status >= 500) {
        throw {message:'网络错误', status, url, data: config.data}
    }
    if (status >= 400) {
        throw {message, status, url, data: config.data}
    }
    return data;
}

function validateStatus(status) {
    return status >= 200 && status < 600; // default
}


export const setTitle = (title)=>{
    document.title = `${title} - WeiboLU`
}
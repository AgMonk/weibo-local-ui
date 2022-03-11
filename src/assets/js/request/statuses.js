//https://weibo.com/ajax/statuses/longtext?id=LiWb10Peh


import {wbGetRequest, weiboPostRequest} from "@/assets/js/request/request";
import {getCache} from "@/assets/js/utils/StorageUtils";


//https://weibo.com/ajax/statuses/longtext?id=LiWb10Peh
//获取动态完整文本
export const getLongText = (uuid) => {
    return wbGetRequest({
        url: '/statuses/longtext',
        params: {id: uuid}
    }).then(res => {
        return res.data
    })
}

//获取表情数据 ，解析为字典和分组
export const getConfig = () => {
    return wbGetRequest({
        url: '/statuses/config',
    }).then(res => {
        const {emoticon, emoticon_format} = res.data

        const map = {}
        const groups = []
        for (let i = 0; i < emoticon_format.length; i++) {
            const {key, url, value} = emoticon_format[i]
            const members = value.map(member => {
                const {icon, type, url, value} = member
                return {icon, url, value, type};
            })
            members.forEach(item => map[item.value] = item)
            groups.push({key, url, members: members.map(i => i.value)})
        }

        return {map, groups}
    })
}

export const setLike = (id) => {
    return weiboPostRequest({
        url: '/statuses/setLike',
        data: {id: id + ''},
        headers: {
            'x-xsrf-token': getCache('token'),
        }
    }).then(res => {
        return res.status.attitudes_count
    })
}

export const cancelLike = (id) => {
    return weiboPostRequest({
        url: '/statuses/cancelLike',
        data: {id: id + ''},
        headers: {
            'x-xsrf-token': getCache('token')
        }
    })
}

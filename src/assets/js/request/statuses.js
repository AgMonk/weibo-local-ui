//https://weibo.com/ajax/statuses/longtext?id=LiWb10Peh


import {wbGetRequest, weiboPostRequest} from "@/assets/js/request/request";
import {getCache} from "@/assets/js/utils/StorageUtils";
import {parseSingleStatus, parseStatues, parseText,} from "@/assets/js/request/feed";


//https://weibo.com/ajax/statuses/longtext?id=LiWb10Peh
//获取动态完整文本
export const getLongText = (uuid) => {
    return wbGetRequest({
        url: '/statuses/longtext',
        params: {id: uuid}
    }).then(res => res.data.longTextContent.split('\n').map(i => parseText(i)))
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

export const updateLike = (id) => {
    return weiboPostRequest({
        url: '/statuses/updateLike',
        data: {
            object_id: `${id}`,
            object_type: "comment"
        },
        headers: {
            'x-xsrf-token': getCache('token'),
        }
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

export const destroyLike = (id) => {
    return weiboPostRequest({
        url: '/statuses/destroyLike',
        data: {
            object_id: `${id}`,
            object_type: "comment"
        },
        headers: {
            'x-xsrf-token': getCache('token'),
        }
    })
}


export const normalRepost = ({id, comment, isRepost = false, isComment = false,}) => {
    return weiboPostRequest({
        url: '/statuses/normal_repost',
        data: {
            id, comment,
            pic_id: "",
            is_repost: 0,
            comment_ori: 0,
            is_comment: isComment ? 1 : 0,
            visible: 0,
            share_id: "",
        },
        headers: {
            'x-xsrf-token': getCache('token')
        }
    })
}
/**
 * 获取评论
 * @param id 动态ID
 * @param flow 排序方式 0 = 热度 1 = 时间
 * @param maxId
 * @param count
 * @param uid
 * @param type
 * @returns {AxiosPromise}
 */
export const getComments = ({id, flow = 1, maxId, count = 20, uid, type}) => {
    return wbGetRequest({
        url: '/statuses/buildComments',
        params: {
            flow, id, count, uid, type
            , is_reload: 1
            , is_show_bulletin: 2
            , is_mix: 0
            , max_id: maxId
        },
    }).then(res => {
        const maxId = res.max_id;
        const total = res.total_number
        const data = res.data.map(i => parseSingleStatus(i))
        const contents = data.map(i => i.content)
        const authors = data.map(i => i.author)
        const comments = data.map(i => i.comments).filter(i => i).flatMap(i => i)
        return {contents, authors, total, maxId, comments}
    })
}


export const getEditHistory = (mid, page = 1) => {
    return wbGetRequest({url: '/statuses/editHistory', params: {mid, page}}).then(res => parseStatues(res.statuses).contents)
}

export const getStatusDetail = (id) => {
    return wbGetRequest({
        url: '/statuses/show',
        params: {id}
    }).then(res => parseSingleStatus(res))
}
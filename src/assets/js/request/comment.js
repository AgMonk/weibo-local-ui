import {weiboPostRequest} from "@/assets/js/request/request";
import {getCache} from "@/assets/js/utils/StorageUtils";

export const normalRepost = ({id, comment, isRepost = false,}) => {
    return weiboPostRequest({
        url: '/comments/create',
        data: {
            id, comment,
            pic_id: "",
            is_repost: isRepost ? 1 : 0,
            comment_ori: 0,
            is_comment: 0,
            visible: 0,
            share_id: "",
        },
        headers: {
            'x-xsrf-token': getCache('token')
        }
    })
}
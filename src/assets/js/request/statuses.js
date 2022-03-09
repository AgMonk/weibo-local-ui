//https://weibo.com/ajax/statuses/longtext?id=LiWb10Peh


import {wbGetRequest} from "@/assets/js/request/request";


//https://weibo.com/ajax/statuses/longtext?id=LiWb10Peh
export const getLongText = (uuid) =>{
    return wbGetRequest({
        url: '/statuses/longtext',
        params: {id:uuid}
    }).then(res =>{
        return  res.data
    })
}
import {wbGetRequest} from "@/assets/js/request/request";


export const getAllGroups =() =>{
    return wbGetRequest({
        url:'/feed/allGroups',
        params:{
            is_new_segment:1,
            fetch_hot:1,
        }
    })
}
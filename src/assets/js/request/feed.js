import {wbGetRequest} from "@/assets/js/request/request";


export const getAllGroups =() =>{
    return wbGetRequest({
        url:'/feed/allGroups',
        params:{
            is_new_segment:1,
            fetch_hot:1,
        }
    }).then(res=>{
        const groups = res.groups
        console.log(groups)
        return groups
    }).then(res=>res.map(group=>{
        const {title,group_type,priority} = group
        const data = group.group.map(item=> ({
            gid: Number(item.gid),
            // uid: Number(item.uid),
            type: Number(item.type),
            sysGroup: Number(item.sysgroup),
            title: item.title,
            isUnread: item.is_unread
        }))

        return {title,type:group_type,priority,data}
    }))
}
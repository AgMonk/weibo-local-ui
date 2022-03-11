import {wbGetRequest} from "@/assets/js/request/request";

export const getUnreadHint = async (groupIds) => {
    const res = await wbGetRequest({
        url: '/message/unreadHint',
        params: {
            group_ids: groupIds.join(',')
        },
    }).then(res => res.data.groups.map(item => {
            const gid = Object.keys(item)[0]
            const count = item[gid]
            return {gid, count}
        }).filter(item => item.count > 0)
    )
    const map = {}
    res.forEach(item => map[item.gid] = item.count)
    return map;
}
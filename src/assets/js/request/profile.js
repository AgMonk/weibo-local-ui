import {wbGetRequest} from "@/assets/js/request/request";


export const getUserInfoByName = (name) => {
    return wbGetRequest({
        url: '/profile/info',
        params: {
            screen_name: name,
        }
    }).then(res => {
        console.log(res)

        return res
    })
}
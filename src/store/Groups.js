// 分组
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {getAllGroups, getFriendsTimeline} from "@/assets/js/request/feed";
import {distinctById} from "@/assets/js/utils/ObjUtils";

export default {
    namespaced: true,
    state: {
        groups: {},
        friendsTimeline: {},
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        getAllGroups: ({dispatch, commit, state}, force) => {
            return getCacheByTime({
                cacheObj: state.groups,
                key: '所有分组',
                requestMethod: () => getAllGroups(),
                seconds: 30 * 60,
                force,
            })
        },
        getFriendsTimeline: ({dispatch, commit, state}, {listId, fid, count = 10, sinceId, maxId, refresh = 4}) => {
            return getFriendsTimeline({listId, fid, count, sinceId, maxId, refresh}).then(res => {
                const {sinceId, maxId, data} = res
                if (!state.friendsTimeline[`${listId}`]) {
                    state.friendsTimeline[`${listId}`] = {data: []}
                }
                const timeline = state.friendsTimeline[`${listId}`]
                timeline.sinceId = sinceId
                timeline.maxId = maxId
                timeline.data.push(...data)
                timeline.data = distinctById(timeline.data)
                timeline.data.sort((a, b) => b.content.timestamp.create.time - a.content.timestamp.create.time)
                console.log(data)
            })
        },
        getFirstTimeline: ({dispatch, commit, state}, listId) => {
            return dispatch('getFriendsTimeline',{listId,count:20})
        },
        getMoreTimeline: ({dispatch, commit, state}, listId) => {
            const timeline = state.friendsTimeline[`${listId}`]
            return dispatch('getFriendsTimeline',{maxId:timeline.maxId,listId,count:20})
        }

    },
    getters: {},
}
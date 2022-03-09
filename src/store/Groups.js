// 分组
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {getAllGroups, getFriendsTimeline} from "@/assets/js/request/feed";

export default {
    namespaced: true,
    state: {
        groups:{},
        friendsTimeline:[],
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
        getFriendsTimeline: ({dispatch, commit, state}, {listId, fid, count = 10, sinceId, maxId, refresh = 4,clearCache}) => {
        },
    },
    getters: {},
}
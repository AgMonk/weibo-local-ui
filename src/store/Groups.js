// 分组
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {getAllGroups} from "@/assets/js/request/feed";

export default {
    namespaced: true,
    state: {
        groups:{},
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
    },
    getters: {},
}
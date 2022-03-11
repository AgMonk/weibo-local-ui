// 分组
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {getAllGroups, getTimeline} from "@/assets/js/request/feed";

const getStatusKey = (gid) => `${gid}`

export default {
    namespaced: true,
    state: {
        cache: {},
        groups: {},
        timeline: {},
    },
    mutations: {
        method(state, payload) {

        },
        saveContent2Cache(state, content) {
            const key = getStatusKey(content.id)
            state.cache[key] = content;
        },
        clearTimeline(state, gid) {
            state.timeline[`${gid}`] = {data: []}
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
        getTimeline: ({dispatch, commit, state}, {listId, fid, count = 10, sinceId, maxId, refresh = 4, type}) => {
            const key = getStatusKey(listId)
            const reqMaxId = maxId;
            return getTimeline({listId, fid, count, sinceId, maxId, refresh, type}).then(res => {
                const {sinceId, maxId, authors, contents, retweeted} = res
                if (!state.timeline[key]) {
                    state.timeline[key] = {data: []}
                }
                console.log(contents)

                //保存作者信息
                authors.forEach(user => commit('User/saveUser2Cache', user, {root: true}));
                // 保存动态信息
                contents.forEach(i => commit('saveContent2Cache', i))
                // 保存转发动态信息
                if (retweeted) {
                    retweeted.forEach(i => commit('saveContent2Cache', i))
                }

                const timeline = state.timeline[key]
                timeline.sinceId = sinceId
                timeline.maxId = maxId
                const contentsId = contents.map(i => i.id);
                if (reqMaxId) {
                    timeline.data.push(...contentsId)
                } else {
                    timeline.data = [...contentsId, ...timeline.data]
                }
                return timeline.data
            })
        },
        getFirstTimeline: ({dispatch, commit, state}, {listId, type}) => {
            return dispatch('getTimeline', {listId, type})
        },
        getMoreTimeline: ({dispatch, commit, state}, {listId, type}) => {
            const timeline = state.timeline[`${listId}`]
            return dispatch('getTimeline', {maxId: timeline.maxId, listId, type})
        }

    },
    getters: {
        getStatusFromCache: (state) => (id) => {
            const key = getStatusKey(id)
            return state.cache[key]
        },
    },
}
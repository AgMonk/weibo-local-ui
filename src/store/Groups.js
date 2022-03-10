// 分组
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {getAllGroups, getFriendsTimeline} from "@/assets/js/request/feed";

const getStatusKey = (gid) => `${gid}`

export default {
    namespaced: true,
    state: {
        cache: {},
        groups: {},
        friendsTimeline: {},
    },
    mutations: {
        method(state, payload) {

        },
        saveContent2Cache(state, content) {
            const key = getStatusKey(content.id)
            state.cache[key] = content;
        },
        clearTimeline(state, gid) {
            state.friendsTimeline[`${gid}`] = {data: []}
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
            const key = getStatusKey(listId)
            return getFriendsTimeline({listId, fid, count, sinceId, maxId, refresh}).then(res => {
                const {sinceId, maxId, authors, contents, retweeted} = res
                if (!state.friendsTimeline[key]) {
                    state.friendsTimeline[key] = {data: []}
                }
                console.log(contents)

                //todo 保存作者信息
                console.log(authors[0])
                authors.forEach(user => commit('User/saveUser2Cache', user, {root: true}));

                // 保存动态信息
                contents.forEach(i => commit('saveContent2Cache', i))
                if (retweeted) {
                    retweeted.forEach(i => commit('saveContent2Cache', i))
                }

                const timeline = state.friendsTimeline[key]
                timeline.sinceId = sinceId
                timeline.maxId = maxId
                timeline.data.push(...contents.map(i => i.id))
                return timeline.data
            })
        },
        getFirstTimeline: ({dispatch, commit, state}, listId) => {
            return dispatch('getFriendsTimeline', {listId, count: 20})
        },
        getMoreTimeline: ({dispatch, commit, state}, listId) => {
            const timeline = state.friendsTimeline[`${listId}`]
            return dispatch('getFriendsTimeline', {maxId: timeline.maxId, listId, count: 20})
        }

    },
    getters: {
        getStatusFromCache: (state) => (id) => {
            const key = getStatusKey(id)
            return state.cache[key]
        }
    },
}
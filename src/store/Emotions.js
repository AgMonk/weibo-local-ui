// 表情管理
// noinspection JSUnusedLocalSymbols

import {getConfig} from "@/assets/js/request/statuses";

export default {
    namespaced: true,
    state: {
        map: {},
        emoGroups: [],
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        getConfig: ({dispatch, commit, state}) => {
            return getConfig().then(res => {
                state.map = res.map;
                state.emoGroups = res.groups
                console.log(res.map)
            })
        },
    },
    getters: {
        getEmotionFromMap: (state) => (text) => {
            return state.map[text]
        }
    },
}
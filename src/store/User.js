// 用户
// noinspection JSUnusedLocalSymbols

const getUserKey = (uid) => `${uid}`


export default {
    namespaced: true,
    state: {
        cache: {},
        //名称到id的映射
        map: {},
    },
    mutations: {
        method(state, payload) {

        },
        saveUser2Cache(state, user) {
            const key = getUserKey(user.id)
            state.cache[key] = user;
        },

    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {
        getUserFromCache: (state) => (id) => {
            const key = getUserKey(id)
            return state.cache[key]
        },
        getUserIdFromMap: (state) => (name) => {
            return state.map[name]
        },
    },
}
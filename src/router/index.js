import {createRouter, createWebHistory} from 'vue-router'
import WbGroupMessages from "@/views/groups/WbGroupMessages";

const routes = [
    {
        path: '/', redirect: '/my-groups',
    },
    {
        path: '/my-groups',
        name: '我的分组',
        component: () => import('../views/groups/MyGroups'),
        children: [
            {path: ':type/:gid', name: "分组消息", component: WbGroupMessages}
        ]
    },
    {
        path: '/config',
        name: '配置',
        component: () => import( '../views/Config.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

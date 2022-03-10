import {createRouter, createWebHistory} from 'vue-router'
import WbGroupMessages from "@/views/groups/WbGroupMessages";

const routes = [
    {
        path: '/', redirect: '/my-groups',
    },
    {
        path: '/my-groups',
        name: '我的分组',
        component: () => import('../views/MyGroups'),
        children: [
            {path: ':type/:gid', name: "分组消息", component: WbGroupMessages}
        ]
    },
    {
        path: '/about',
        name: 'About',
        component: () => import( '../views/About.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router

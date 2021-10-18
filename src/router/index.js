import Vue from 'vue'
import Router from 'vue-router'

// import Home from '@/components/pages/home/Home.vue'
import Login from './../components/pages/login/Login.vue'
import AdminDashboard from './../components/pages/Dashboard'
import store from '../components/store'
import listMenu from './listMenu'

Vue.use(Router)



let router = new Router({
    mode: 'history',
    linkActiveClass: 'is-active',
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,

        },
        {
            path: '/404',
            component: () => import('./../components/pages/404')
        },
        {
            path: '*',
            redirect: '/404'
        },
        {
            path: '/',
            name: 'page',
            component: AdminDashboard,
            redirect: '/home',
            meta: {
                requiresAuth: true,
                linkText: "Home"
            },
            children: listMenu
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn && store.getters.user) {
            next();
            return
        }
        next('/')
    }
    next()
});




export default router
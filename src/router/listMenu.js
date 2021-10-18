import store from '../components/store'
const listMenu = [

    {
        path: 'home',
        name: 'home',
        component: () => import('./../components/pages/home/Home'),
        meta: {
            linkText: "Dashboard"
        },

    },
    {
        path: 'user',
        name: 'user',
        text: 'User',
        component: () => import('./../components/pages/user/User'),
        meta: {
            requiresAuth: true,
            linkText: "User"
        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;
                for (let i = 0; i < menuUser.length; i++) {
                    if (menuUser[i].nama === 'user') {
                        next();
                        return
                    }
                }
            }
            next('/404')
        }
    },
    {
        path: 'menu',
        name: 'menu',
        component: () => import('./../components/pages/menu/Menu'),
        meta: {
            requiresAuth: true,
            linkText: "Menu"
        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;
                for (let i = 0; i < menuUser.length; i++) {
                    if (menuUser[i].nama === 'menu') {
                        next();
                        return
                    }
                }
            }
            next('/404')
        }
    },
    {
        path: 'role',
        name: 'role',
        component: () => import('./../components/pages/role/Role'),
        meta: {
            requiresAuth: true,
            linkText: "Role"

        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;
                for (let i = 0; i < menuUser.length; i++) {
                    if (menuUser[i].nama === 'role') {
                        next();
                        return
                    }
                }
            }
            next('/404')
        }
    },

];

export default listMenu
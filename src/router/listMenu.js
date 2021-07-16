import store from '../components/store'
const listMenu = [

    {
        path: 'home',
        name: 'home',
        component: () => import('./../components/pages/home/Home'),
        // meta: {
        //     requiresAuth: true,
        // },
        // beforeEnter(to, from, next) {
        //     if (to.matched.some(record => record.meta.requiresAuth)) {
        //         const menuUser = store.getters.menuUser;

        //         for (let i = 0; i < menuUser.length; i++) {

        //             if (menuUser[i].nama === 'home') {
        //                 next();
        //                 return
        //             }
        //         }
        //     }
        //     next('/404')
        // }

    },
    {
        path: 'user',
        name: 'user',
        component: () => import('./../components/pages/user/User'),
        meta: {
            requiresAuth: true,
        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;
                for (let i = 0; i < menuUser.length; i++) {
                    for (let j = 0; j < menuUser[i].anak.length; j++) {
                        if (menuUser[i].anak[j].nama === 'user') {
                            next();
                            return
                        }
                    }
                }
            }
            next('/404')
        }
    },
    {
        path: 'fungsi',
        name: 'fungsi',
        component: () => import('./../components/pages/fungsi/Fungsi'),
        meta: {
            requiresAuth: true,
        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;
                for (let i = 0; i < menuUser.length; i++) {
                    for (let j = 0; j < menuUser[i].anak.length; j++) {
                        if (menuUser[i].anak[j].nama === 'fungsi') {
                            next();
                            return
                        }
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
        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;
                for (let i = 0; i < menuUser.length; i++) {
                    for (let j = 0; j < menuUser[i].anak.length; j++) {
                        if (menuUser[i].anak[j].nama === 'menu') {
                            next();
                            return
                        }
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
        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;
                for (let i = 0; i < menuUser.length; i++) {
                    for (let j = 0; j < menuUser[i].anak.length; j++) {
                        if (menuUser[i].anak[j].nama === 'role') {
                            next();
                            return
                        }
                    }
                }
            }
            next('/404')
        }
    },
    {
        path: 'absen',
        name: 'absen',
        component: () => import('./../components/pages/absen/Absen'),
        meta: {
            requiresAuth: true,
        },
        beforeEnter(to, from, next) {
            if (to.matched.some(record => record.meta.requiresAuth)) {
                const menuUser = store.getters.menuUser;

                for (let i = 0; i < menuUser.length; i++) {

                    if (menuUser[i].nama === 'absen') {
                        next();
                        return
                    }
                }
            }
            next('/404')
        }
    }
];

export default listMenu
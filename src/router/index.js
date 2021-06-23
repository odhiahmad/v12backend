import Vue from 'vue'
import Router from 'vue-router'

// import Home from '@/components/pages/home/Home.vue'
import Login from './../components/pages/login/Login.vue'
import UsersDashboard from './../components/pages/UsersDashboard'
import AdminDashboard from './../components/pages/AdminDashboard'
import store from '../components/store'


Vue.use(Router)
let router = new Router({
    mode: 'history',
    routes: [
        
        {
            path: '/',
            name: 'login',
            component: Login,
           
        },
        {   path: '/404',  
            component:() => import('../components/pages/404') 
        },  
        {   path: '*', 
            redirect: '/404' 
        },  
        {
            path: '/user',
            name: 'userboard',
            component: UsersDashboard,
            redirect:'/user/home',
            meta: {
                requiresAuth: true,
                cs:true
            },
            children:[
              {
                  path:'home',
                  name:'userHome',
                  component:() => import('../components/pages/csPage/home/Home')
              },
              {
                path:'absen',
                name:'userAbsen',
                component:() => import('../components/pages/csPage/absen/Absen')
            }
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboard,
            meta: {
                requiresAuth: true,
                admin : true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLoggedIn && store.getters.user) {
            if(to.matched.some(record => record.meta.admin)) {
                if (store.getters.role == 'Admin') {
                    next();
                    return
                }
                next('/')
            }else if(to.matched.some(record => record.meta.cs)) {
                if (store.getters.role == 'CS') {
                    next();
                    return
                }
                next('/')
            }
        }
        next('/')
    }
    next()
 
    
})

export default router
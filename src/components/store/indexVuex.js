import Vue from 'vue'
import Vuex from 'vuex'
import menu from './menu'
import menuAll from './menuAll'
import role from './role'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    plugins: [],
    mutations: {
    },
    actions: {

    },
    modules: {
        menu,
        menuAll,
        role
    }
})
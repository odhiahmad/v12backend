import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import menu from './menu'
import menuUser from './menuUser'
import role from './role'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  plugins: [
    createPersistedState({
      getState: (key) => Cookies.getJSON(key),
      setState: (key, state) => Cookies.set(key, state, { expires: 3, secure: true })
    }),

  ],
  mutations: {
  },
  actions: {

  },
  modules: {
    menu,
    auth,
    menuUser,
    role
  }
})
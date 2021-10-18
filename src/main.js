import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import VueRouter from 'vue-router'
import router from './router/index'
import axios from 'axios'
import { setHeaderToken } from './components/utils/auth'
import store from './components/store'
import vSelect from "vue-select";
import Vuex from 'vuex'
import 'vue-select/dist/vue-select.css';
import "./vee-validate";
import "../src/filters/filter"
import 'buefy/dist/buefy.css'
import VueApexCharts from 'vue-apexcharts'


Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.component("v-select", vSelect);
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://localhost:3000/api/'
Vue.use(VueRouter)

Vue.use(Vuex)
Vue.use(Buefy)
Vue.config.productionTip = false

axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    const {
      response: { status, data }
    } = err;
    if (status === 401 & data.berhasil === false) {
      store.dispatch('logout')
    }

  }

);

const token = localStorage.getItem('token');
if (token) {
  setHeaderToken(token)
}

Vue.config.productionTip = false;
store.dispatch('getMenuUser')
store.dispatch('getMenu')
store.dispatch('getRole')

store.dispatch('get_user')
  .then(() => {

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }).catch((error) => {
    console.error(error);
  })
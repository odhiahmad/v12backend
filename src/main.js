import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueRouter from 'vue-router'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import router from './router/index'
import axios from 'axios'
import { setHeaderToken } from './components/utils/auth'
import store from './components/store'

Vue.component('vue-fontawesome', FontAwesomeIcon);

axios.defaults.baseURL = 'http://localhost:3000/api/'
Vue.use(VueRouter)
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
});
Vue.config.productionTip = false
const token = localStorage.getItem('token');

if (token) { 
  setHeaderToken(token) 
} 

// module.exports = {   
//   devServer: { 
//     port: 300,     
//     proxy: "http://localhost"   
//   } 
// }

store.dispatch('get_user', token)
.then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}).catch((error) => {
  console.error(error);
})
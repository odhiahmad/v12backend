import axios from "axios"
import { removeHeaderToken, setHeaderToken } from "../utils/auth"
import jwt_decode from "jwt-decode";

export default{
    state: { 
        user: null,
        isLoggedIn: false, 
        role:null,
    },
    mutations: { 
        set_user (state, data) {
            state.user = data
            state.role = data.role
            state.isLoggedIn = true
        }, 
        reset_user (state) {
            state.user = null
            state.role = null
            state.isLoggedIn = false
        }
    },
    getters:{ 
        isLoggedIn (state){
            return state.isLoggedIn
          },
          user (state) {
            return state.user
          },
          role(state){
              return state.role
          }
    },
    actions: { 
        login({ dispatch, commit }, data) {
            return new Promise((resolve, reject) => { 
              axios.post('users/login', data)
               .then(response => {
                if(response.data.berhasil == true){
                    const token = response.data.token  
                    localStorage.setItem('token', token) 
                    setHeaderToken(token) 
                    dispatch('get_user')
                    resolve(response)
                }else{
                    commit('reset_user')  
                    localStorage.removeItem('token')
                }
                
               })
               .catch(err => {
                 commit('reset_user')  
                 localStorage.removeItem('token')
                 reject(err)
              })
            })
          },
        async get_user({commit}){ 
            if(!localStorage.getItem('token')){
              return
            }
            try{ 
              var token =localStorage.getItem('token');
              var decoded = jwt_decode(token);  
              console.log(decoded.result)  
                commit('set_user', decoded.result)
            } catch (error){
                commit('reset_user') 
                removeHeaderToken()
                localStorage.removeItem('token')
                return error
            } 
          }
    } 
  }
import axios from "axios"
import jwt_decode from "jwt-decode";


export default {
    state: {
        menuUser: [],
    },

    mutations: {
        set_menu_user(state, data) {

            state.menuUser = data.data;
        },
        reset_menu_user(state) {
            state.menuUser = []

        }
    },
    getters: {
        menuUser(state) {
            return state.menuUser
        },

    },
    actions: {
        getMenuUser({ commit }) {
            if (!localStorage.getItem('token')) {
                return
            }
            try {
                var token = localStorage.getItem('token');
                var decoded = jwt_decode(token);

                return new Promise((resolve, reject) => {
                    axios.get('fungsi/getFungsidanMenuByRole/' + decoded.result.role)
                        .then(response => {
                            resolve(response)
                            commit('set_menu_user', response.data)
                        })
                        .catch(err => {
                            commit('reset_menu_user')
                            reject(err)
                        })


                })
            } catch (error) {
                commit('reset_menu_user')
                return error
            }
        }
    }
}
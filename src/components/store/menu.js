import axios from "axios"

export default {
    state: {
        menu: [],
    },

    mutations: {
        set_menu(state, data) {
            state.menu = data
        },
        reset_menu(state) {
            state.menu = []

        }
    },
    getters: {
        menu(state) {
            return state.menu
        },

    },
    actions: {
        getMenu({ commit }) {

            try {
                return new Promise((resolve, reject) => {
                    axios.get('menus/getMenuAll')
                        .then(response => {

                            resolve(response)
                            commit('set_menu', response.data.data)

                        })
                        .catch(err => {
                            commit('reset_menu')
                            reject(err)
                        })


                })
            } catch (error) {
                commit('reset_menu')
                return error
            }
        }
    }
}
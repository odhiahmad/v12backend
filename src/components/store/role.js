import axios from "axios"

export default {
    state: {
        role: [],
    },

    mutations: {
        set_role(state, data) {
            state.role = data
        },
        reset_role(state) {
            state.role = []

        }
    },
    getters: {
        role(state) {
            return state.role
        },

    },
    actions: {
        getRole({ commit }) {

            try {
                return new Promise((resolve, reject) => {
                    axios.get('roles/getRoleAll')
                        .then(response => {

                            resolve(response)
                            commit('set_role', response.data.data)

                        })
                        .catch(err => {
                            commit('reset_role')
                            reject(err)
                        })


                })
            } catch (error) {
                commit('reset_role')
                return error
            }
        }
    }
}
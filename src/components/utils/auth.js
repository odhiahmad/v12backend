import axios from 'axios'

export function setHeaderToken(token) {
  if (token)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export function removeHeaderToken() {
  delete axios.defaults.headers.common['Authorization']
}
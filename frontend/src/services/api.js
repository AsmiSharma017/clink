// import axios from 'axios'

// const api = axios.create({ baseURL: '/' })

// // Auto-add token to requests
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// export const graphql = async (query, variables = {}) => {
//   const { data } = await api.post('/graphql', { query, variables })
//   if (data.errors) throw new Error(data.errors[0].message)
//   return data.data
// }

// export const auth = {
//   login: (creds) => api.post('/api/auth/login', creds),
//   register: (data) => api.post('/api/auth/register', data),
//   logout: () => {
//     localStorage.clear()
//     delete api.defaults.headers.common.Authorization
//     window.location.href = '/login'
//   }
// }

// export default api

import axios from 'axios'

const api = axios.create({
  baseURL: '/'
})

// Auto-add token
api.interceptors.request.use(config => {

  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



// GRAPHQL
export const graphql = async (query, variables = {}) => {

  const { data } = await api.post('/graphql', { query, variables })

  if (data.errors) throw new Error(data.errors[0].message)

  return data.data
}



// AUTH FUNCTIONS
export const auth = {

  login: (role, creds) =>
    api.post(`/api/auth/${role}/login`, creds),

  register: (role, data) =>
    api.post(`/api/auth/${role}/register`, data),

  logout: () => {
    localStorage.clear()
    delete api.defaults.headers.common.Authorization
    window.location.href = '/login'
  }

}

export default api
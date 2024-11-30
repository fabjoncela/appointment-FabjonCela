import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../store/authSlice'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout())
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

//if the response is 401 or 403, the user is logged out and redirected to the login page
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            store.dispatch(logout())
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api 
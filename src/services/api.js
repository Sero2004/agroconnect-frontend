import axios from 'axios'

const api = axios.create({
    baseURL: 'https://agroconnect-backend-djtm.onrender.com/api'
})

// Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.authorization = token
    }
    return config
})

export default api
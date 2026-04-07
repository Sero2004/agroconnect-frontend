import axios from 'axios'

const api = axios.create({
    baseURL: 'https://agroconnect-backend-djtm.onrender.com/api'
})

// Ajoute automatiquement le token JWT avec le format correct
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        // AJOUT DE "Bearer " AVEC L'ESPACE
        config.headers.Authorization = `Bearer ${token}` 
    }
    return config
})

export default api
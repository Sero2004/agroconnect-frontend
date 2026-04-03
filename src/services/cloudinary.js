import axios from 'axios'

const CLOUD_NAME = 'dwgynsnfx'
const UPLOAD_PRESET = 'agroconnect_preset'

export const uploadImage = async (file) => {
    const typesAutorises = ['image/jpeg', 'image/png', 'image/webp']
    if (!typesAutorises.includes(file.type)) {
        throw new Error('Format non autorisé. Utilise JPG, PNG ou WEBP.')
    }

    if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image trop lourde. Maximum 2MB.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
        )
        return res.data.secure_url
    } catch (err) {
        console.error('Cloudinary erreur détaillée:', err.response?.data)
        throw new Error(err.response?.data?.error?.message || 'Erreur upload image')
    }
}
import api from './axiosInstance';

export const fileApi = {
    // Upload profile image
    uploadProfileImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/user/files/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    // Get profile image URL
    getProfileImageUrl: (filename) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        return `${baseUrl}/user/files/uploads/${filename}`;
    },
    
    // Delete profile image
    deleteProfileImage: () => 
        api.delete('/user/files/profile-image'),
};

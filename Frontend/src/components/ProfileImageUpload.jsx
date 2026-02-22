import React, { useState, useRef } from 'react';
import { Upload, X, Camera, User } from 'lucide-react';
import { fileApi } from '../api/fileApi';
import Button from './ui/Button';

const ProfileImageUpload = ({ currentImage, onImageUploaded, className = '' }) => {
    const [preview, setPreview] = useState(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 5MB');
            return;
        }

        setError('');
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        try {
            const response = await fileApi.uploadProfileImage(file);
            const imageUrl = response.data?.data?.imageUrl || response.data?.imageUrl;
            if (onImageUploaded) {
                onImageUploaded(imageUrl);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload image');
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleRemoveImage = async () => {
        try {
            await fileApi.deleteProfileImage();
            setPreview(null);
            if (onImageUploaded) {
                onImageUploaded(null);
            }
        } catch (err) {
            setError('Failed to remove image');
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div 
                className={`relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 transition-all
                    ${dragActive 
                        ? 'border-primary-500 border-dashed bg-primary-50' 
                        : 'border-secondary-200 bg-secondary-100'
                    }
                    ${uploading ? 'opacity-50' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {preview ? (
                    <>
                        <img 
                            src={preview} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                        {!uploading && (
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User size={48} className="text-secondary-400" />
                    </div>
                )}
                
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Overlay camera button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                >
                    <Camera size={16} />
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleInputChange}
                className="hidden"
            />

            {/* Upload button */}
            <div className="text-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2"
                >
                    <Upload size={16} />
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <p className="text-xs text-secondary-500 mt-2">
                    JPEG, PNG, GIF or WebP. Max 5MB.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ProfileImageUpload;

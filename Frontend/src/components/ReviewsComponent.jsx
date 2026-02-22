import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, Edit2, Trash2 } from 'lucide-react';
import { reviewApi } from '../api/reviewApi';
import Button from './ui/Button';

const ReviewsComponent = ({ providerUsername, serviceId, showForm = false, onReviewSubmitted }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
        serviceId: serviceId || null,
        providerUsername: providerUsername || ''
    });
    const [submitting, setSubmitting] = useState(false);
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        fetchReviews();
    }, [providerUsername, serviceId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            let response;
            if (serviceId) {
                response = await reviewApi.getServiceReviews(serviceId);
            } else if (providerUsername) {
                response = await reviewApi.getProviderReviews(providerUsername);
            }
            setReviews(response?.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingReview) {
                await reviewApi.updateReview(editingReview.id, formData);
            } else {
                await reviewApi.submitReview({
                    ...formData,
                    serviceId: serviceId,
                    providerUsername: providerUsername
                });
            }
            setShowReviewForm(false);
            setEditingReview(null);
            setFormData({ rating: 5, comment: '', serviceId, providerUsername });
            fetchReviews();
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await reviewApi.deleteReview(reviewId);
            fetchReviews();
        } catch (err) {
            setError('Failed to delete review');
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setFormData({
            rating: review.rating,
            comment: review.comment,
            serviceId: review.serviceId,
            providerUsername: review.providerUsername
        });
        setShowReviewForm(true);
    };

    const StarRating = ({ rating, interactive = false, onChange }) => {
        const [hover, setHover] = useState(0);
        
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={interactive ? 28 : 16}
                        className={`${
                            star <= (interactive ? (hover || rating) : rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-secondary-300'
                        } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
                        onClick={() => interactive && onChange(star)}
                        onMouseEnter={() => interactive && setHover(star)}
                        onMouseLeave={() => interactive && setHover(0)}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-secondary-100 h-24 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-secondary-900">
                    Reviews ({reviews.length})
                </h3>
                {showForm && currentUser && !showReviewForm && (
                    <Button onClick={() => setShowReviewForm(true)} size="sm">
                        Write a Review
                    </Button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-secondary-50 p-6 rounded-xl space-y-4">
                    <h4 className="font-semibold text-secondary-900">
                        {editingReview ? 'Edit Your Review' : 'Write Your Review'}
                    </h4>
                    
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Rating
                        </label>
                        <StarRating 
                            rating={formData.rating} 
                            interactive 
                            onChange={(rating) => setFormData({ ...formData, rating })} 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Share your experience..."
                            required
                        />
                    </div>
                    
                    <div className="flex gap-3">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                                setShowReviewForm(false);
                                setEditingReview(null);
                                setFormData({ rating: 5, comment: '', serviceId, providerUsername });
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-secondary-500 text-center py-8">
                        No reviews yet. Be the first to review!
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div 
                            key={review.id} 
                            className="bg-white border border-secondary-200 rounded-xl p-5 space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-secondary-900">
                                            {review.reviewerUsername}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <StarRating rating={review.rating} />
                                            <span className="text-sm text-secondary-500">
                                                {review.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-secondary-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                    {currentUser?.username === review.reviewerUsername && (
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => handleEditReview(review)}
                                                className="p-1.5 text-secondary-400 hover:text-primary-600 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteReview(review.id)}
                                                className="p-1.5 text-secondary-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <p className="text-secondary-600 leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewsComponent;

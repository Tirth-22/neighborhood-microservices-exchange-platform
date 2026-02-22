import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, X } from 'lucide-react';
import { availabilityApi } from '../api/availabilityApi';
import Button from './ui/Button';

const TimeSlotPicker = ({ 
    providerUsername, 
    onSlotSelected, 
    selectedSlot,
    requestId,
    className = '' 
}) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [booking, setBooking] = useState(false);
    
    // Generate date range for next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = nextWeek.toISOString().split('T')[0];

    useEffect(() => {
        if (providerUsername) {
            fetchSlots();
        }
    }, [providerUsername]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await availabilityApi.getAvailableSlots(
                providerUsername, 
                startDate, 
                endDate
            );
            setSlots(response?.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
            setError('Failed to load available time slots');
        } finally {
            setLoading(false);
        }
    };

    const handleBookSlot = async (slot) => {
        if (!requestId) {
            if (onSlotSelected) onSlotSelected(slot);
            return;
        }
        
        setBooking(true);
        try {
            await availabilityApi.bookSlot(slot.id, requestId);
            if (onSlotSelected) onSlotSelected(slot);
            fetchSlots();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book slot');
        } finally {
            setBooking(false);
        }
    };

    // Group slots by date
    const slotsByDate = slots.reduce((acc, slot) => {
        const date = slot.slotDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (dateStr === today.toISOString().split('T')[0]) return 'Today';
        if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
        
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (loading) {
        return (
            <div className={`animate-pulse space-y-4 ${className}`}>
                <div className="h-8 bg-secondary-100 rounded w-1/3" />
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-12 bg-secondary-100 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                <Calendar size={18} className="text-primary-600" />
                Select Time Slot
            </h4>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {Object.keys(slotsByDate).length === 0 ? (
                <div className="text-center py-8 bg-secondary-50 rounded-xl">
                    <Clock size={32} className="mx-auto text-secondary-400 mb-2" />
                    <p className="text-secondary-500">No available time slots found</p>
                    <p className="text-sm text-secondary-400 mt-1">
                        Please contact the provider for availability
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Date tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {Object.keys(slotsByDate).map((date) => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date === selectedDate ? '' : date)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                                    ${selectedDate === date 
                                        ? 'bg-primary-600 text-white' 
                                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                                    }`}
                            >
                                {formatDate(date)}
                                <span className="ml-1 text-xs opacity-75">
                                    ({slotsByDate[date].length})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Time slots for selected date */}
                    {selectedDate && slotsByDate[selectedDate] && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {slotsByDate[selectedDate].map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => handleBookSlot(slot)}
                                    disabled={booking || slot.isBooked}
                                    className={`p-3 rounded-lg text-sm font-medium transition-all
                                        ${selectedSlot?.id === slot.id 
                                            ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2'
                                            : slot.isBooked
                                                ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                                                : 'bg-white border border-secondary-200 text-secondary-700 hover:border-primary-500 hover:bg-primary-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <Clock size={14} />
                                        {formatTime(slot.startTime)}
                                    </div>
                                    <div className="text-xs opacity-75 mt-1">
                                        - {formatTime(slot.endTime)}
                                    </div>
                                    {selectedSlot?.id === slot.id && (
                                        <Check size={14} className="mx-auto mt-1" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimeSlotPicker;

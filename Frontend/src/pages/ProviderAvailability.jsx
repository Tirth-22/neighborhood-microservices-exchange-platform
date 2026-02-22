import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Calendar, Clock, Plus, Trash2, RefreshCw, Check } from 'lucide-react';
import { availabilityApi } from '../api/availabilityApi';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const ProviderAvailability = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    const [availability, setAvailability] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('schedule');
    
    // Form state for adding availability
    const [newAvailability, setNewAvailability] = useState({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '17:00',
        slotDurationMinutes: 60
    });

    // Date range for slot generation/viewing
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const [dateRange, setDateRange] = useState({
        startDate: today.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchAvailability();
        fetchSlots();
    }, []);

    const fetchAvailability = async () => {
        try {
            const response = await availabilityApi.getProviderAvailability(user?.username);
            setAvailability(response?.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch availability:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        try {
            const response = await availabilityApi.getProviderSchedule(
                dateRange.startDate, 
                dateRange.endDate
            );
            setSlots(response?.data?.data || []);
        } catch (err) {
            console.error('Failed to fetch slots:', err);
        }
    };

    const handleAddAvailability = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        
        try {
            await availabilityApi.setAvailability(newAvailability);
            setSuccess('Availability added successfully!');
            fetchAvailability();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add availability');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAvailability = async (id) => {
        if (!window.confirm('Delete this availability?')) return;
        
        try {
            await availabilityApi.deleteAvailability(id);
            fetchAvailability();
        } catch (err) {
            setError('Failed to delete availability');
        }
    };

    const handleGenerateSlots = async () => {
        setGenerating(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await availabilityApi.generateTimeSlots(
                dateRange.startDate, 
                dateRange.endDate
            );
            const count = response?.data?.data?.length || 0;
            setSuccess(`Generated ${count} time slots!`);
            fetchSlots();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate slots');
        } finally {
            setGenerating(false);
        }
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDay = (day) => {
        return day.charAt(0) + day.slice(1).toLowerCase();
    };

    // Group slots by date
    const slotsByDate = slots.reduce((acc, slot) => {
        const date = slot.slotDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/provider-dashboard')}
                    className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Manage Availability</h1>
                    <p className="text-secondary-600">Set your working hours and generate bookable time slots</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                        <Check size={18} />
                        <span className="font-medium">{success}</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === 'schedule' 
                                ? 'bg-primary-600 text-white' 
                                : 'bg-white text-secondary-700 hover:bg-secondary-100'
                        }`}
                    >
                        Weekly Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab('slots')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === 'slots' 
                                ? 'bg-primary-600 text-white' 
                                : 'bg-white text-secondary-700 hover:bg-secondary-100'
                        }`}
                    >
                        Time Slots
                    </button>
                </div>

                {activeTab === 'schedule' && (
                    <div className="space-y-6">
                        {/* Add Availability Form */}
                        <Card className="p-6 border-none shadow-sm bg-white">
                            <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <Plus size={20} className="text-primary-600" />
                                Add Working Hours
                            </h3>
                            
                            <form onSubmit={handleAddAvailability} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Day</label>
                                        <select
                                            value={newAvailability.dayOfWeek}
                                            onChange={(e) => setNewAvailability({...newAvailability, dayOfWeek: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500"
                                        >
                                            {DAYS_OF_WEEK.map(day => (
                                                <option key={day} value={day}>{formatDay(day)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            value={newAvailability.startTime}
                                            onChange={(e) => setNewAvailability({...newAvailability, startTime: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            value={newAvailability.endTime}
                                            onChange={(e) => setNewAvailability({...newAvailability, endTime: e.target.value})}
                                            className="w-full px-3 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 mb-1">Slot Duration</label>
                                        <select
                                            value={newAvailability.slotDurationMinutes}
                                            onChange={(e) => setNewAvailability({...newAvailability, slotDurationMinutes: parseInt(e.target.value)})}
                                            className="w-full px-3 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value={30}>30 minutes</option>
                                            <option value={60}>1 hour</option>
                                            <option value={90}>1.5 hours</option>
                                            <option value={120}>2 hours</option>
                                        </select>
                                    </div>
                                </div>
                                <Button type="submit" disabled={saving}>
                                    {saving ? 'Saving...' : 'Add Availability'}
                                </Button>
                            </form>
                        </Card>

                        {/* Current Availability */}
                        <Card className="p-6 border-none shadow-sm bg-white">
                            <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <Calendar size={20} className="text-primary-600" />
                                Your Weekly Schedule
                            </h3>
                            
                            {availability.length === 0 ? (
                                <div className="text-center py-8 text-secondary-500">
                                    <Clock size={32} className="mx-auto mb-2 text-secondary-300" />
                                    <p>No availability set yet</p>
                                    <p className="text-sm">Add your working hours above</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {DAYS_OF_WEEK.map(day => {
                                        const dayAvail = availability.find(a => a.dayOfWeek === day);
                                        return (
                                            <div 
                                                key={day} 
                                                className={`flex items-center justify-between p-3 rounded-lg ${
                                                    dayAvail ? 'bg-green-50' : 'bg-secondary-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`font-medium ${dayAvail ? 'text-green-700' : 'text-secondary-400'}`}>
                                                        {formatDay(day)}
                                                    </span>
                                                    {dayAvail && (
                                                        <span className="text-sm text-green-600">
                                                            {formatTime(dayAvail.startTime)} - {formatTime(dayAvail.endTime)}
                                                            <span className="text-xs ml-2 text-secondary-500">
                                                                ({dayAvail.slotDurationMinutes} min slots)
                                                            </span>
                                                        </span>
                                                    )}
                                                    {!dayAvail && (
                                                        <span className="text-sm text-secondary-400">Not available</span>
                                                    )}
                                                </div>
                                                {dayAvail && (
                                                    <button
                                                        onClick={() => handleDeleteAvailability(dayAvail.id)}
                                                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'slots' && (
                    <div className="space-y-6">
                        {/* Generate Slots */}
                        <Card className="p-6 border-none shadow-sm bg-white">
                            <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <RefreshCw size={20} className="text-primary-600" />
                                Generate Time Slots
                            </h3>
                            
                            <div className="flex flex-wrap gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        min={today.toISOString().split('T')[0]}
                                        onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                                        className="px-3 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        min={dateRange.startDate}
                                        onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                                        className="px-3 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <Button onClick={handleGenerateSlots} disabled={generating || availability.length === 0}>
                                    {generating ? 'Generating...' : 'Generate Slots'}
                                </Button>
                                <Button variant="outline" onClick={fetchSlots}>
                                    Refresh
                                </Button>
                            </div>
                            
                            {availability.length === 0 && (
                                <p className="text-sm text-amber-600 mt-3">
                                    ⚠️ Set your weekly schedule first before generating slots
                                </p>
                            )}
                        </Card>

                        {/* View Slots */}
                        <Card className="p-6 border-none shadow-sm bg-white">
                            <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-primary-600" />
                                Your Time Slots ({slots.length} total)
                            </h3>
                            
                            {Object.keys(slotsByDate).length === 0 ? (
                                <div className="text-center py-8 text-secondary-500">
                                    <Calendar size={32} className="mx-auto mb-2 text-secondary-300" />
                                    <p>No time slots generated yet</p>
                                    <p className="text-sm">Generate slots from your weekly schedule</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                                        <div key={date}>
                                            <h4 className="font-medium text-secondary-900 mb-2">
                                                {new Date(date).toLocaleDateString('en-US', { 
                                                    weekday: 'long', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {dateSlots.map(slot => (
                                                    <div 
                                                        key={slot.id}
                                                        className={`px-3 py-2 rounded-lg text-sm ${
                                                            slot.isBooked 
                                                                ? 'bg-red-100 text-red-700' 
                                                                : 'bg-green-100 text-green-700'
                                                        }`}
                                                    >
                                                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                        {slot.isBooked && (
                                                            <span className="ml-1 text-xs">(Booked)</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderAvailability;

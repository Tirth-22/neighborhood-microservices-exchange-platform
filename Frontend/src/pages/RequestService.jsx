import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { requestApi } from '../api/requestApi';
import { availabilityApi } from '../api/availabilityApi';

const RequestService = () => {
    const navigate = useNavigate();
    const selectedService = JSON.parse(localStorage.getItem("selectedService"));
    const providerUsername = selectedService?.providerUsername || selectedService?.provider?.username || '';

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [slotLoading, setSlotLoading] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotError, setSlotError] = useState('');

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!formData.date || !providerUsername) {
                setAvailableSlots([]);
                setSlotError('');
                return;
            }

            setSlotLoading(true);
            setSlotError('');

            try {
                const response = await availabilityApi.getAvailableSlots(providerUsername, formData.date, formData.date);
                const slots = (response?.data?.data || []).filter((slot) => !slot.isBooked);
                setAvailableSlots(slots);

                // Keep selected time in sync with valid slots.
                if (!slots.some((slot) => (slot.startTime || '').slice(0, 5) === formData.time)) {
                    setFormData((prev) => ({
                        ...prev,
                        time: slots.length > 0 ? (slots[0].startTime || '').slice(0, 5) : ''
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch provider slots', error);
                setAvailableSlots([]);
                setSlotError('Could not load provider slots for this date.');
            } finally {
                setSlotLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [formData.date, providerUsername]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const normalizedServiceType = String(selectedService?.category || 'OTHER')
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '_');

            if (providerUsername && (!formData.date || !formData.time)) {
                throw new Error('Please choose date and time from provider available slots.');
            }

            if (providerUsername && availableSlots.length === 0) {
                throw new Error('Provider is not available on selected date. Please pick another date.');
            }

            if (providerUsername && !availableSlots.some((slot) => (slot.startTime || '').slice(0, 5) === formData.time)) {
                throw new Error('Selected time is not in provider available slots.');
            }

            const payload = {
                title: `${selectedService?.name || selectedService?.category || 'Service'} Request`,
                serviceType: normalizedServiceType,
                description: formData.description,
                providerUsername: providerUsername || null,
                price: selectedService?.price,
                address: formData.address,
                scheduledAt: formData.time.length === 5
                    ? `${formData.date}T${formData.time}:00`
                    : `${formData.date}T${formData.time}`,
                paymentMethod: 'CASH',
                serviceOfferingId: selectedService?.id
            };

            await requestApi.createRequest(payload);
            localStorage.removeItem("selectedService");
            navigate('/my-requests');
        } catch (error) {
            console.error("Failed to create request", error);
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                (error?.message === 'Network Error'
                    ? 'Unable to reach backend (/api/requests). Please ensure Docker services are running.'
                    : error?.message) ||
                "Failed to submit request. Please try again.";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedService) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center border-none shadow-xl bg-white">
                    <div className="w-16 h-16 bg-secondary-100 text-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-secondary-900 mb-2">No Service Selected</h2>
                    <p className="text-secondary-500 mb-6">Please choose a service from the marketplace first.</p>
                    <Button onClick={() => navigate('/services')} className="w-full">Browse Services</Button>
                </Card>
            </div>
        );
    }

    // Validate required fields
    if (!selectedService.name && !selectedService.category) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center border-none shadow-xl bg-white">
                    <h2 className="text-xl font-bold text-secondary-900 mb-2">Invalid Service Data</h2>
                    <p className="text-secondary-500 mb-6">Service information is incomplete. Please try again.</p>
                    <Button onClick={() => navigate('/services')} className="w-full">Browse Services</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors mb-8 font-medium"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Request {selectedService.name}</h1>
                    <p className="text-secondary-500 font-medium">
                        Provider: <span className="text-primary-600">{providerUsername || selectedService.providerName || 'Auto-assign'}</span> • ₹{selectedService.price}
                    </p>
                </div>

                <Card className="p-10 border-none shadow-sm rounded-3xl bg-white">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-50 text-primary-600 flex items-center justify-center text-xs">1</span>
                                Describe the issue
                            </h3>
                            <div className="pt-2">
                                <textarea
                                    className="w-full p-4 rounded-xl bg-secondary-50 border-none focus:ring-2 focus:ring-primary-500 outline-none min-h-[140px] transition-all resize-none text-secondary-900 placeholder:text-secondary-400"
                                    placeholder="What help do you need exactly?"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-50 text-primary-600 flex items-center justify-center text-xs">2</span>
                                When & Where
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-secondary-600">Date</label>
                                    <Input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="bg-secondary-50 border-none h-12 text-secondary-900"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-secondary-600">Time</label>
                                    {providerUsername ? (
                                        <select
                                            required
                                            disabled={!formData.date || slotLoading || availableSlots.length === 0}
                                            className="w-full rounded-xl bg-secondary-50 border-none h-12 px-3 text-secondary-900 disabled:text-secondary-400"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        >
                                            {!formData.date && <option value="">Select date first</option>}
                                            {formData.date && slotLoading && <option value="">Loading slots...</option>}
                                            {formData.date && !slotLoading && availableSlots.length === 0 && (
                                                <option value="">No slots available</option>
                                            )}
                                            {availableSlots.map((slot) => {
                                                const slotStart = (slot.startTime || '').slice(0, 5);
                                                const slotEnd = (slot.endTime || '').slice(0, 5);
                                                return (
                                                    <option key={slot.id} value={slotStart}>
                                                        {slotStart} - {slotEnd}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    ) : (
                                        <Input
                                            type="time"
                                            required
                                            className="bg-secondary-50 border-none h-12 text-secondary-900"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl p-3 text-sm font-medium bg-secondary-50 text-secondary-700">
                                {!providerUsername && 'Provider slots are unavailable for this service; request can still be submitted.'}
                                {providerUsername && !formData.date && 'Choose a date to load provider available slots.'}
                                {providerUsername && formData.date && slotLoading && 'Checking provider availability...'}
                                {providerUsername && formData.date && !slotLoading && availableSlots.length > 0 && (
                                    <span className="text-green-700">Provider is available: {availableSlots.length} slot(s) found for this date.</span>
                                )}
                                {providerUsername && formData.date && !slotLoading && availableSlots.length === 0 && !slotError && (
                                    <span className="text-amber-700">Provider is not available on this date.</span>
                                )}
                                {slotError && <span className="text-red-600">{slotError}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-secondary-600">Address</label>
                                <Input
                                    placeholder="House no, Street, Area"
                                    required
                                    className="bg-secondary-50 border-none h-12 text-secondary-900"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-secondary-900 flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-blue-50 text-primary-600 flex items-center justify-center text-xs">3</span>
                                Review
                            </h3>
                            <div className="py-4 px-4 rounded-xl border-2 border-secondary-100 bg-secondary-50 text-secondary-700 font-semibold text-sm">
                                Confirm your details and submit your request.
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-5 text-lg font-bold rounded-2xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Confirm & Submit Request'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RequestService;

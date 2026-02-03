import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { requestApi } from '../api/requestApi';

const RequestService = () => {
    const navigate = useNavigate();
    const selectedService = JSON.parse(localStorage.getItem("selectedService"));
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: '',
        description: '',
        payment: 'cash'
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: `${selectedService?.category} Request`,
                serviceType: selectedService?.category?.toUpperCase() || "OTHER",
                description: formData.description,
                providerUsername: selectedService?.providerUsername || selectedService?.name,
                price: selectedService?.price,
                address: formData.address,
                scheduledAt: `${formData.date}T${formData.time}:00`
            };

            await requestApi.createRequest(payload);
            localStorage.removeItem("selectedService");
            navigate('/my-requests');
        } catch (error) {
            console.error("Failed to create request", error);
            alert("Failed to submit request. Please try again.");
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
                        Provider: <span className="text-primary-600">{selectedService.providerUsername || selectedService.name}</span> • ₹{selectedService.price}
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
                                    <Input
                                        type="time"
                                        required
                                        className="bg-secondary-50 border-none h-12 text-secondary-900"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
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
                                Payment Method
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                {['cash', 'online'].map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, payment: method })}
                                        className={`py-4 px-2 rounded-xl border-2 transition-all font-bold text-sm capitalize ${formData.payment === method
                                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                                            : 'border-secondary-100 bg-white text-secondary-500 hover:border-secondary-200'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
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

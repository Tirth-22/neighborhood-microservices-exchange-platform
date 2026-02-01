import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { Calendar, Clock, MapPin, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { requestApi } from '../api/requestApi';

const RequestService = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
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
                description: `${formData.description} \n\n[Scheduled: ${formData.date} at ${formData.time}] \nAddress: ${formData.address}`,
                providerUsername: selectedService?.providerUsername || selectedService?.name,
            };

            await requestApi.createRequest(payload);
            setStep(3);
            localStorage.removeItem("selectedService");
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
                <Card className="max-w-md w-full p-8 text-center border-none shadow-xl">
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
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Stepper */}
                <div className="flex items-center justify-center mb-10 gap-4">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-secondary-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>1</div>
                        <span className="font-medium hidden sm:inline">Details</span>
                    </div>
                    <div className="w-12 h-px bg-secondary-200"></div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-secondary-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>2</div>
                        <span className="font-medium hidden sm:inline">Confirm</span>
                    </div>
                    <div className="w-12 h-px bg-secondary-200"></div>
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-secondary-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-secondary-200'}`}>3</div>
                        <span className="font-medium hidden sm:inline">Success</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Side */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <Card className="p-8 border-none shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
                                    Service Details
                                </h2>
                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-secondary-700 flex items-center gap-2">
                                                <Calendar size={16} className="text-primary-500" /> Preferred Date
                                            </label>
                                            <Input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-secondary-700 flex items-center gap-2">
                                                <Clock size={16} className="text-primary-500" /> Time
                                            </label>
                                            <Input
                                                type="time"
                                                required
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}

                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-secondary-700 flex items-center gap-2">
                                            <MapPin size={16} className="text-primary-500" /> Service Address
                                        </label>
                                        <Input
                                            placeholder="Enter full address"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}

                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-secondary-700 flex items-center gap-2">
                                            <MessageSquare size={16} className="text-primary-500" /> Notes for Provider
                                        </label>
                                        <textarea
                                            className="w-full p-4 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 outline-none min-h-[120px] transition-all"
                                            placeholder="Tell the provider more about your requirements..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <Button className="w-full py-4 text-lg font-bold group" type="submit">
                                        Continue to Review <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card className="p-8 border-none shadow-xl animate-in fade-in zoom-in-95 duration-500">
                                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Review & Confirm</h2>
                                <div className="space-y-6 bg-secondary-50/50 p-6 rounded-2xl border border-secondary-100">
                                    <div className="flex justify-between border-b border-secondary-100 pb-4">
                                        <span className="text-secondary-500">Service</span>
                                        <span className="font-bold text-secondary-900">{selectedService.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-secondary-100 pb-4">
                                        <span className="text-secondary-500">Schedule</span>
                                        <span className="font-bold text-secondary-900">{formData.date} at {formData.time}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-secondary-100 pb-4">
                                        <span className="text-secondary-500">Location</span>
                                        <span className="font-bold text-secondary-900">{formData.address}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={loading}>Go Back</Button>
                                    <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                                        {loading ? 'Submitting...' : 'Confirm Request'}
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card className="p-12 text-center border-none shadow-2xl animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-secondary-900 mb-4">Request Sent!</h2>
                                <p className="text-secondary-600 mb-8 max-w-sm mx-auto">
                                    Your request has been successfully sent to <span className="font-bold text-secondary-900">{selectedService.name}</span>. You'll be notified once they respond.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button onClick={() => navigate('/notifications')} className="w-full">View My Notifications</Button>
                                    <Button variant="ghost" onClick={() => navigate('/services')} className="w-full text-secondary-500">Return to Marketplace</Button>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Summary Side */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 border-none shadow-lg sticky top-24 bg-primary-600 text-white overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <h3 className="text-lg font-bold mb-4 relative z-10">Service Summary</h3>
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <Badge className="bg-white/20 text-white border-none mb-2">{selectedService.category}</Badge>
                                    <h4 className="font-bold text-xl">{selectedService.name}</h4>
                                </div>
                                <div className="pt-4 border-t border-white/20">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-primary-100 text-sm">Provider</span>
                                        <span className="font-medium">{selectedService.providerUsername || selectedService.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary-100 text-sm">Hourly Rate</span>
                                        <span className="font-bold text-lg">₹{selectedService.price}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestService;

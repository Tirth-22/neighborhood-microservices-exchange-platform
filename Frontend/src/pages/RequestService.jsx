import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { requestApi } from '../api/requestApi';

const RequestService = () => {
    const navigate = useNavigate();

    const selectedService = JSON.parse(
        localStorage.getItem("selectedService")
    );

    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");
    const [payment, setPayment] = useState("Cash");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const handleSubmit = async () => {
        // Validate Date
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("Whoops! You cannot book a service in the past. Please select a future date.");
            return;
        }

        try {
            const payload = {
                title: `${selectedService?.category} Request`,
                serviceType: selectedService?.category?.toUpperCase() || "OTHER",
                description: `${description} \n\n[Scheduled: ${date} at ${time}]`, // Send Schedule Info
                providerUsername: selectedService?.providerUsername || selectedService?.name, // Ensure we pass the username
                // Add other fields if backend supports them or pack them in description
            };

            await requestApi.createRequest(payload);
            navigate("/my-requests");
            localStorage.removeItem("selectedService");
        } catch (error) {
            console.error("Failed to create request", error);
            alert("Failed to submit request.");
        }
    }

    if (!selectedService) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="mb-4 text-secondary-600">No service selected.</p>
                    <Button onClick={() => navigate('/services')}>Go to Services</Button>
                </div>
            </div>
        )
    }

    // Visual Stepper
    const steps = [
        { number: 1, title: 'Details' },
        { number: 2, title: 'Schedule' },
        { number: 3, title: 'Confirm' },
    ];

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                {/* Stepper Visual */}
                <div className="flex items-center justify-center mb-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-primary-600 text-white' : 'bg-white text-secondary-400 border border-secondary-200'}`}>
                                {step.number}
                            </div>
                            <span className={`ml-2 text-sm font-medium ${index === 0 ? 'text-primary-700' : 'text-secondary-400'} hidden sm:block`}>
                                {step.title}
                            </span>
                            {index < steps.length - 1 && (
                                <div className="w-12 h-px bg-secondary-200 mx-4" />
                            )}
                        </div>
                    ))}
                </div>

                <Button
                    variant="ghost"
                    className="mb-4 pl-0 hover:bg-transparent hover:text-primary-600"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Button>

                <Card className="p-8 shadow-lg border-none">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-secondary-900">Request {selectedService?.category}</h2>
                        <p className="text-secondary-500 mt-1">Provider: <span className="font-semibold text-primary-600">{selectedService?.name}</span> • <span className="text-secondary-700 font-medium">₹{selectedService?.price}/hr</span></p>
                    </div>

                    <div className="space-y-8">
                        {/* Section 1: Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-secondary-900 font-medium border-b border-secondary-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600 text-xs">1</span>
                                Describe the issue
                            </div>
                            <textarea
                                rows="3"
                                placeholder="What help do you need exactly?"
                                className="w-full rounded-lg border border-secondary-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-secondary-50 focus:bg-white transition-colors"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Section 2: Schedule & Location */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-secondary-900 font-medium border-b border-secondary-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600 text-xs">2</span>
                                When & Where
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-secondary-50 focus:bg-white"
                                />
                                <Input
                                    label="Time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="bg-secondary-50 focus:bg-white"
                                />
                            </div>
                            <Input
                                label="Address"
                                placeholder="House no, Street, Area"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="bg-secondary-50 focus:bg-white"
                            />
                        </div>

                        {/* Section 3: Payment */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-secondary-900 font-medium border-b border-secondary-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600 text-xs">3</span>
                                Payment Method
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {['Cash', 'Online', 'Exchange'].map((method) => (
                                    <label
                                        key={method}
                                        className={`
                                            flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                                            ${payment === method
                                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold ring-1 ring-primary-600 shadow-sm'
                                                : 'border-secondary-200 hover:border-secondary-300 text-secondary-600 hover:bg-secondary-50'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method}
                                            checked={payment === method}
                                            onChange={(e) => setPayment(e.target.value)}
                                            className="sr-only"
                                        />
                                        {method === 'Exchange' ? 'Service Exchange' : method}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                size="lg"
                                className="w-full py-4 text-lg shadow-lg shadow-primary-500/20"
                                onClick={handleSubmit}
                            >
                                Confirm & Submit Request
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RequestService;

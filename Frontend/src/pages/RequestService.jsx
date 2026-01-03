import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RequestService = () => {
    const navigate = useNavigate();

    const selectedService = JSON.parse(
        localStorage.getItem("selectedService")
    );

    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [address, setAddress] = useState("");
    const [payment, setPayment] = useState("");

    const handleSubmit = () => {
        const newRequest = {
            id: Date.now(),              
            serviceName: selectedService?.category,
            provider: selectedService?.name,
            description,
            date,
            time,
            address,
            payment,
            status: "Pending",
        };
        const existingRequests = JSON.parse(localStorage.getItem("myRequests")) || [];
        existingRequests.push(newRequest)
        localStorage.setItem("myRequests",JSON.stringify(existingRequests));
        navigate("/my-requests");
        localStorage.removeItem("selectedService");
    }

    return (
        <div className='bg-gray-100 mt-0 pt-4'>
            <ArrowLeft onClick={() => navigate(-1)} className="mx-4 cursor-pointer transition-transform duration-200 hover:scale-110" />
            <span className='mx-4'>back</span>
            <div className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">

                    <h2 className="text-3xl font-bold mb-6 text-center">
                        Request a Service
                    </h2>

                    <div className="mb-6 p-4 bg-blue-50 rounded">
                        <p className="font-semibold text-gray-700">
                            Service: <span className="text-blue-600">{selectedService?.category || "Service"}</span>
                        </p>
                        <p className="text-gray-600">
                            Provider: {selectedService?.name || "Provider"}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Problem Description
                        </label>
                        <textarea
                            rows="4"
                            placeholder="Describe your issue..."
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium text-gray-700">
                                Preferred Time
                            </label>
                            <input
                                type="time"
                                className="w-full border rounded px-3 py-2"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-medium text-gray-700">
                            Service Address
                        </label>
                        <input
                            type="text"
                            placeholder="House no, Street, Area"
                            className="w-full border rounded px-3 py-2"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-700">
                            Payment Method
                        </label>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" value={payment} onChange={(e) => setPayment(e.target.value)} />
                                Cash
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" value={payment} onChange={(e) => setPayment(e.target.value)} />
                                Online
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="radio" name="payment" value={payment} onChange={(e) => setPayment(e.target.value)} />
                                Service Exchange
                            </label>
                        </div>
                    </div>

                    <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700" >
                        Submit Request
                    </button>

                </div>
            </div>
        </div>
    );
};

export default RequestService;

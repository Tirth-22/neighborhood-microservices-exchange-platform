import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const MyRequests = () => {

    useEffect(() => {
        const storageRequest = JSON.parse(localStorage.getItem("myRequests")) || [];
        setRequests(storageRequest);
    },[]);

    const [requests, setRequests] = useState([]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "text-yellow-600";
            case "Accepted":
                return "text-blue-600";
            case "Completed":
                return "text-green-600";
            case "Cancelled":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    const handleCancel = (id) => {
        const updateRequests = requests.map((req) => 
            req.id === id ? {...req,status:"Cancelled"} : req
        );
        localStorage.setItem("requests",JSON.stringify(updateRequests));
        setRequests(updateRequests);
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">

                <h2 className="text-3xl font-bold mb-6">
                    My Service Requests
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-3">Service</th>
                                <th className="p-3">Provider</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b">
                                    <td className="p-3">{req.serviceName}</td>
                                    <td className="p-3">{req.provider}</td>
                                    <td className="p-3">{req.date}</td>
                                    <td className={`p-3 font-semibold ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </td>
                                    <td className="p-3">
                                        <Link
                                            to={`/request/${req.id}`}
                                            className="text-blue-600 hover:underline mr-3"> View
                                        </Link>
                                        {req.status === "Pending" && (
                                            <button
                                                onClick={() => handleCancel(req.id)}
                                                className="text-red-600 hover:underline">Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyRequests;

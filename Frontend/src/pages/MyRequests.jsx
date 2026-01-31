import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react";
import { requestApi } from "../api/requestApi";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await requestApi.getMyRequests();
                setRequests(response.data); // Axios returns data in .data
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const getStatusVariant = (status) => {
        switch (status) {
            case "Pending": return "warning";
            case "Accepted":
            case "accepted": return "primary";
            case "Completed":
            case "completed": return "success";
            case "Cancelled": return "danger";
            default: return "default";
        }
    };

    const handleCancel = (id) => {
        const updateRequests = requests.map((req) =>
            req.id === id ? { ...req, status: "Cancelled" } : req
        );
        localStorage.setItem("requests", JSON.stringify(updateRequests));
        setRequests(updateRequests);
    }

    const handleComplete = (id) => {
        const updateRequests = requests.map((req) =>
            req.id === id ? { ...req, status: "Completed" } : req
        );
        localStorage.setItem("requests", JSON.stringify(updateRequests));
        setRequests(updateRequests);
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-secondary-900">My Requests</h2>
                        <p className="text-secondary-500 mt-1">Track and manage your service requests.</p>
                    </div>
                    <Link to="/services">
                        <Button>New Request</Button>
                    </Link>
                </div>

                {requests.length === 0 ? (
                    <Card className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-secondary-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No Requests Yet</h3>
                        <p className="text-secondary-500 mb-6 max-w-sm mx-auto">
                            You haven't made any service requests yet. Find a service provider to get started.
                        </p>
                        <Link to="/services">
                            <Button>Browse Services</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <Card key={req.id} className="group hover:shadow-md transition-all duration-200 border-secondary-200">
                                <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between md:hidden mb-4">
                                            <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                            <h3 className="text-lg font-bold text-secondary-900">{req.serviceName}</h3>
                                            <span className="hidden md:inline-block text-secondary-300">•</span>
                                            <div className="flex items-center text-secondary-600">
                                                <User size={14} className="mr-1" />
                                                <span className="text-sm">{req.provider}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary-500">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1.5" />
                                                {req.date}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock size={14} className="mr-1.5" />
                                                {req.time}
                                            </div>
                                            {req.address && (
                                                <div className="flex items-center">
                                                    <MapPin size={14} className="mr-1.5" />
                                                    <span className="truncate max-w-[200px]">{req.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 self-end md:self-auto w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-secondary-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <div className="hidden md:block">
                                            <Badge variant={getStatusVariant(req.status)} className="px-3 py-1 text-xs">{req.status}</Badge>
                                        </div>

                                        <div className="flex gap-2">
                                            {req.status === "Pending" && (
                                                <Button size="sm" variant="danger" onClick={() => handleCancel(req.id)}>
                                                    Cancel
                                                </Button>
                                            )}
                                            {req.status === "accepted" && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleComplete(req.id)}>
                                                    Mark Complete
                                                </Button>
                                            )}
                                            <Link to={`/request/${req.id}`}>
                                                <Button size="sm" variant="secondary" className="group-hover:bg-secondary-100">
                                                    Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRequests;

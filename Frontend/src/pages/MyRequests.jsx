import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Calendar, Clock, MapPin, User, X, FileText, DollarSign } from "lucide-react";
import { requestApi } from "../api/requestApi";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await requestApi.getMyRequests();
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getStatusVariant = (status) => {
        switch (String(status).toLowerCase()) {
            case "pending": return "warning";
            case "accepted": return "primary";
            case "completed": return "success";
            case "cancelled":
            case "rejected": return "danger";
            default: return "default";
        }
    };

    const handleCancel = async (id) => {
        try {
            await requestApi.cancelRequest(id);
            fetchRequests();
        } catch (error) {
            console.error("Failed to cancel request", error);
            alert("Failed to cancel request");
        }
    };

    const handleComplete = async (id) => {
        try {
            await requestApi.completeRequest(id);
            fetchRequests();
        } catch (error) {
            console.error("Failed to mark request as complete", error);
            alert("Failed to complete request");
        }
    };

    const openDetailsModal = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedRequest(null), 300); // Delay to allow animation
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-secondary-900">My Requests</h2>
                        <p className="text-secondary-500 mt-1">Track and manage your service requests.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <Card className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="text-secondary-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-2">No Requests Yet</h3>
                        <p className="text-secondary-500 mb-6 max-w-sm mx-auto">
                            You haven't made any service requests yet. Find a service provider to get started.
                        </p>
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
                                            <h3 className="text-lg font-bold text-secondary-900">{req.title || "Service Request"}</h3>
                                            <span className="hidden md:inline-block text-secondary-300">•</span>
                                            <div className="flex items-center text-secondary-600">
                                                <User size={14} className="mr-1" />
                                                <span className="text-sm">{req.providerUsername || "Checking provider..."}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary-500">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1.5" />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock size={14} className="mr-1.5" />
                                                {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                            {(String(req.status).toLowerCase() === "pending") && (
                                                <Button size="sm" variant="danger" onClick={() => handleCancel(req.id)}>
                                                    Cancel
                                                </Button>
                                            )}
                                            {(String(req.status).toLowerCase() === "accepted") && (
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleComplete(req.id)}>
                                                    Mark Complete
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="group-hover:bg-secondary-100"
                                                onClick={() => openDetailsModal(req)}
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedRequest && (
                            <>
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white border-b border-secondary-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
                                    <div>
                                        <h3 className="text-2xl font-bold text-secondary-900">Request Details</h3>
                                        <p className="text-sm text-secondary-500 mt-1">ID: #{selectedRequest.id}</p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                                    >
                                        <X size={24} className="text-secondary-600" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6 space-y-6">
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between">
                                        <Badge variant={getStatusVariant(selectedRequest.status)} className="px-4 py-2 text-sm">
                                            {selectedRequest.status}
                                        </Badge>
                                        <span className="text-sm text-secondary-500">
                                            Created: {new Date(selectedRequest.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Service Title */}
                                    <div>
                                        <label className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">Service</label>
                                        <p className="text-lg font-bold text-secondary-900 mt-1">
                                            {selectedRequest.title || "Service Request"}
                                        </p>
                                    </div>

                                    {/* Provider Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-secondary-500 uppercase tracking-wider flex items-center gap-1">
                                                <User size={14} /> Provider
                                            </label>
                                            <p className="text-base font-medium text-secondary-900 mt-1">
                                                @{selectedRequest.providerUsername || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-secondary-500 uppercase tracking-wider flex items-center gap-1">
                                                <DollarSign size={14} /> Price
                                            </label>
                                            <p className="text-base font-medium text-secondary-900 mt-1">
                                                ₹{selectedRequest.price || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    {selectedRequest.address && (
                                        <div>
                                            <label className="text-xs font-semibold text-secondary-500 uppercase tracking-wider flex items-center gap-1">
                                                <MapPin size={14} /> Address
                                            </label>
                                            <p className="text-base text-secondary-900 mt-1">
                                                {selectedRequest.address}
                                            </p>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {selectedRequest.description && (
                                        <div>
                                            <label className="text-xs font-semibold text-secondary-500 uppercase tracking-wider flex items-center gap-1">
                                                <FileText size={14} /> Description
                                            </label>
                                            <p className="text-base text-secondary-700 mt-1 bg-secondary-50 p-4 rounded-lg">
                                                {selectedRequest.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Timeline */}
                                    <div className="border-t border-secondary-200 pt-4">
                                        <label className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">Timeline</label>
                                        <div className="mt-3 space-y-2">
                                            <div className="flex items-center text-sm text-secondary-600">
                                                <Calendar size={16} className="mr-2 text-secondary-400" />
                                                <span className="font-medium mr-2">Created:</span>
                                                {new Date(selectedRequest.createdAt).toLocaleString()}
                                            </div>
                                            {selectedRequest.updatedAt && (
                                                <div className="flex items-center text-sm text-secondary-600">
                                                    <Clock size={16} className="mr-2 text-secondary-400" />
                                                    <span className="font-medium mr-2">Last Updated:</span>
                                                    {new Date(selectedRequest.updatedAt).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-secondary-200">
                                        {(String(selectedRequest.status).toLowerCase() === "pending") && (
                                            <Button
                                                variant="danger"
                                                className="flex-1"
                                                onClick={() => {
                                                    handleCancel(selectedRequest.id);
                                                    closeModal();
                                                }}
                                            >
                                                Cancel Request
                                            </Button>
                                        )}
                                        {(String(selectedRequest.status).toLowerCase() === "accepted") && (
                                            <Button
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => {
                                                    handleComplete(selectedRequest.id);
                                                    closeModal();
                                                }}
                                            >
                                                Mark as Complete
                                            </Button>
                                        )}
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRequests;

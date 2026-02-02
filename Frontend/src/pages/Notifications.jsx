import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Bell, CheckCircle, XCircle, Clock, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { requestApi } from "../api/requestApi";
import api from "../api/axiosInstance";

const Notifications = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchNotifications = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get("/notifications/my");
            setNotifications(response.data.content || []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleAction = async (requestId, action, notificationId) => {
        setActionLoading(notificationId);
        try {
            if (action === 'accept') {
                await requestApi.acceptRequest(requestId);
            } else {
                await requestApi.rejectRequest(requestId);
            }
            await api.put(`/notifications/${notificationId}/read`);
            fetchNotifications();
        } catch (error) {
            console.error(`Failed to ${action} request`, error);
            alert(`Failed to ${action} request`);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusIcon = (type) => {
        if (!type) return <Bell size={20} className="text-secondary-400" />;
        switch (type) {
            case 'REQUEST_CREATED':
                return <Clock size={20} className="text-primary-500" />;
            case 'REQUEST_ACCEPTED':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'REQUEST_REJECTED':
                return <XCircle size={20} className="text-red-500" />;
            case 'REQUEST_COMPLETED':
                return <CheckCircle size={20} className="text-blue-500" />;
            default:
                return <Bell size={20} className="text-secondary-400" />;
        }
    };

    const getBadgeVariant = (type) => {
        if (!type) return 'primary';
        if (type.includes('ACCEPTED') || type.includes('COMPLETED')) return 'success';
        if (type.includes('REJECTED') || type.includes('CANCELLED')) return 'danger';
        return 'primary';
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50">
                <Card className="p-8 text-center max-w-md border-none shadow-lg bg-white">
                    <p className="text-secondary-600 mb-4">Please login to view notifications</p>
                    <Link to="/login">
                        <Button>Login Now</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-secondary-900">Notifications</h2>
                            <p className="text-secondary-500 text-sm">Updates on your service requests</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <Card className="text-center py-12 border-none shadow-sm bg-white">
                        <Bell className="mx-auto text-secondary-300 mb-3" size={48} />
                        <p className="text-secondary-500">No new notifications</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <Card key={notif.id} className="p-5 hover:bg-white transition-all border-secondary-200 hover:shadow-md bg-white group">
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1 transition-transform group-hover:scale-110 duration-200">
                                        {getStatusIcon(notif.type)}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-secondary-900 font-medium">
                                                {notif.message}
                                            </p>
                                            <Badge variant={getBadgeVariant(notif.type || '')} className="text-[10px] uppercase tracking-wider">
                                                {(notif.type || 'INFO').replace('REQUEST_', '')}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-secondary-500">
                                            {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recent'}
                                        </p>

                                        {notif.type === 'REQUEST_CREATED' && !notif.read && (
                                            <div className="flex gap-3 mt-4">
                                                <Button
                                                    size="sm"
                                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleAction(notif.requestId, 'accept', notif.id)}
                                                    disabled={actionLoading === notif.id}
                                                >
                                                    <Check size={16} />
                                                    {actionLoading === notif.id ? 'Accepting...' : 'Accept'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleAction(notif.requestId, 'reject', notif.id)}
                                                    disabled={actionLoading === notif.id}
                                                >
                                                    <X size={16} />
                                                    {actionLoading === notif.id ? 'Rejecting...' : 'Reject'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {!notif.read && (
                                        <div className="ml-2">
                                            <span className="w-2 h-2 bg-primary-600 rounded-full inline-block animate-pulse"></span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;

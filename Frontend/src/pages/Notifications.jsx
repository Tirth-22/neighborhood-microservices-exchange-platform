import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                // We need to implement this API call in a new file or inline it here
                // For now assuming we add it to 'requestApi' or similar, but let's use fetch directly or axios
                // Actually, let's create a notificationApi helper first? Or just cheat and use axiosInstance
                const { default: api } = await import("../api/axiosInstance");
                const response = await api.get("/notifications/my");
                setNotifications(response.data.content || []);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const getStatusIcon = (status) => {
        if (status === 'accepted' || status === 'Accepted' || status === 'Completed') return <CheckCircle size={20} className="text-green-500" />;
        if (status === 'rejected' || status === 'Rejected' || status === 'Cancelled') return <XCircle size={20} className="text-red-500" />;
        return <Clock size={20} className="text-yellow-500" />;
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-secondary-900">Notifications</h2>
                        <p className="text-secondary-500 text-sm">Updates on your service requests</p>
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <Card className="text-center py-12">
                        <Bell className="mx-auto text-secondary-300 mb-3" size={48} />
                        <p className="text-secondary-500">No new notifications</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <Card key={notif.id} className="p-5 flex gap-4 items-start hover:bg-secondary-50/50 transition-colors">
                                <div className="mt-1">
                                    <Clock size={20} className="text-primary-500" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-secondary-900 font-medium">
                                        {notif.message}
                                    </p>
                                    <p className="text-sm text-secondary-500 mt-1">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {!notif.read && (
                                    <div className="ml-auto">
                                        <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;

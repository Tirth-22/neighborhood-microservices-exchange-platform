import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("requests")) || [];
        setRequests(stored);
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50">
                <Card className="p-8 text-center max-w-md">
                    <p className="text-secondary-600 mb-4">Please login to view notifications</p>
                    <Link to="/login">
                        <Button>Login Now</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const notifications = requests
        .filter(req => req.userId === user.id)
        .filter(req => req.status !== "Pending");

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
                        {notifications.map((req, index) => (
                            <Card key={index} className="p-5 flex gap-4 items-start hover:bg-secondary-50/50 transition-colors">
                                <div className="mt-1">
                                    {getStatusIcon(req.status)}
                                </div>
                                <div>
                                    <p className="text-secondary-900 font-medium">
                                        Your request for <span className="font-bold">{req.serviceName}</span> was <span className="lowercase">{req.status}</span>.
                                    </p>
                                    <p className="text-sm text-secondary-500 mt-1">
                                        Provider: {req.provider}
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <Badge variant={
                                        ['accepted', 'Accepted', 'Completed'].includes(req.status) ? 'success' : 'danger'
                                    }>
                                        {req.status}
                                    </Badge>
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

import { useState, useEffect } from "react";

const Notifications = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("requests")) || [];
        setRequests(stored);
    }, []);

    if (!user) {
        return (
            <p className="text-center text-red-500 mt-10">
                Please login to view notifications
            </p>
        );
    }

    const notifications = requests
        .filter(req => req.userId === user.id)
        .filter(req => req.status !== "Pending");

    return (
        <div className="max-w-lg mx-auto mt-6 px-3">
            <h2 className="text-xl font-semibold mb-4">
                Notifications
            </h2>

            {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    No notifications available
                </p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map(req => (
                        <li
                            key={req.id}
                            className={`border-l p-3 border rounded-sm `}
                        >
                            <p className="text-l text-gray-800">
                                Your request for{" "}
                                <span className="font-medium">
                                    {req.serviceName}
                                </span>{" "}
                                was{" "}
                                <span
                                    className={
                                        req.status === "accepted"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                >
                                    {req.status}
                                </span>
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;

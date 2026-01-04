import React, { useEffect, useState } from "react";

const ProviderDashboard = () => {
  const provider = JSON.parse(localStorage.getItem("currentUser"));
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem("requests")) || [];
    setRequests(storedRequests);
  }, []);

  const providerRequests = requests.filter(
    (req) => req.providerId === provider?.id
  );

  const pendingRequests = providerRequests.filter(
    (req) => req.status === "Pending"
  );

  const historyRequests = providerRequests.filter(
    (req) => req.status !== "Pending"
  );

  const updateStatus = (id, newStatus) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );

    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    console.log("All requests:", requests);

  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Provider Dashboard
        </h2>

        <h2 className="text-xl font-semibold mt-8 mb-8">
          Pending Request
        </h2>

        {pendingRequests.length === 0 && (
          <p className="text-center text-gray-500">
            No pending service requests
          </p>
        )}

        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Service:{" "}
                  <span className="text-gray-700">
                    {req.serviceName}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  User ID: {req.providerId}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(req.id, "accepted")}
                  className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700">
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(req.id, "rejected")}
                  className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-8">
          Request History
        </h2>
        <div className="space-y-4">
          {historyRequests.map((req) => (
            <div className="border rounded-lg p-4 flex justify-between items-center"
              key={req.id}>
              <p className="text-sm text-gray-500">
                Service: {req.serviceName}
              </p>
              <p className="text-sm font-semibold capitalize">
                Status: {req.status}
              </p>
              <p className="text-l text-gray-500">{req.serviceName}</p>
              <p className="text-sm text-gray-500">{req.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Check, X, Clock, LayoutDashboard, History, Zap } from "lucide-react";

const ProviderDashboard = () => {
  const provider = JSON.parse(localStorage.getItem("currentUser"));
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

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
  };

  const stats = [
    { label: "Total Requests", value: providerRequests.length, icon: LayoutDashboard, color: "bg-blue-100 text-blue-600" },
    { label: "Pending", value: pendingRequests.length, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Completed", value: historyRequests.filter(r => r.status === 'Completed' || r.status === 'accepted').length, icon: Check, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Provider Dashboard</h1>
          <p className="text-secondary-600">Welcome back, {provider?.name || 'Provider'}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 flex items-center justify-between">
              <div>
                <p className="text-secondary-500 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </Card>
          ))}
        </div>

        {/* content tabs */}
        <div className="mb-6 flex space-x-4 border-b border-secondary-200">
          <button
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-primary-600 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests ({pendingRequests.length})
          </button>
          <button
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary-600 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700'}`}
            onClick={() => setActiveTab('history')}
          >
            History ({historyRequests.length})
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === 'pending' ? (
            pendingRequests.length === 0 ? (
              <Card className="text-center py-12">
                <Zap className="mx-auto text-secondary-300 mb-3" size={48} />
                <p className="text-secondary-500">No pending requests at the moment.</p>
              </Card>
            ) : (
              pendingRequests.map((req) => (
                <Card key={req.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="warning">Pending Action</Badge>
                        <span className="text-sm text-secondary-500">ID: #{req.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-secondary-900 mb-1">{req.serviceName}</h3>
                      <p className="text-secondary-600 mb-4">{req.description || "No description provided."}</p>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-secondary-500">
                        <p><strong className="text-secondary-700">Date:</strong> {req.date || 'Flexible'}</p>
                        <p><strong className="text-secondary-700">Time:</strong> {req.time || 'Flexible'}</p>
                        <p><strong className="text-secondary-700">Location:</strong> {req.address}</p>
                        <p><strong className="text-secondary-700">Payment:</strong> {req.payment}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                      <Button
                        onClick={() => updateStatus(req.id, "accepted")}
                        className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-2"
                      >
                        <Check size={16} /> Accept
                      </Button>
                      <Button
                        onClick={() => updateStatus(req.id, "rejected")}
                        variant="danger" // Assuming danger variant styling exists or generic red
                        className="bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center gap-2"

                      >
                        <X size={16} /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )
          ) : (
            historyRequests.length === 0 ? (
              <Card className="text-center py-12">
                <History className="mx-auto text-secondary-300 mb-3" size={48} />
                <p className="text-secondary-500">No history available.</p>
              </Card>
            ) : (
              historyRequests.map((req) => (
                <Card key={req.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{req.serviceName}</h3>
                    <p className="text-sm text-secondary-500">{req.date}</p>
                  </div>
                  <Badge variant={req.status === 'accepted' ? 'success' : 'danger'}>
                    {req.status}
                  </Badge>
                </Card>
              ))
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default ProviderDashboard;

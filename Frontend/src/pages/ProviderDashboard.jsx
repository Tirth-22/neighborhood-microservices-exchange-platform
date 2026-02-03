import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { requestApi } from "../api/requestApi";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Check, Clock, LayoutDashboard, History } from "lucide-react";

const ProviderDashboard = () => {
  const provider = JSON.parse(localStorage.getItem("currentUser"));
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [acceptedRes, completedRes] = await Promise.all([
        requestApi.getAcceptedRequests(),
        requestApi.getCompletedRequests()
      ]);
      setAcceptedRequests(acceptedRes.data || []);
      setCompletedRequests(completedRes.data || []);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const historyRequests = [...acceptedRequests, ...completedRequests].sort((a, b) =>
    new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
  );

  const stats = [
    {
      label: "Active Jobs",
      value: acceptedRequests.length,
      icon: Clock,
      color: "bg-blue-100 text-blue-600"
    },
    {
      label: "Completed",
      value: completedRequests.length,
      icon: Check,
      color: "bg-green-100 text-green-600"
    },
    {
      label: "Total History",
      value: historyRequests.length,
      icon: LayoutDashboard,
      color: "bg-purple-100 text-purple-600"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Provider Dashboard</h1>
          <p className="text-secondary-600">Service Performance & History for {provider?.name || 'Provider'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 flex items-center justify-between border-none shadow-sm bg-white">
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

        <div className="mb-6 flex items-center justify-between border-b border-secondary-200 pb-3">
          <div className="flex items-center gap-2">
            <History size={20} className="text-secondary-400" />
            <h2 className="text-xl font-bold text-secondary-900">Service History</h2>
          </div>
          <span className="text-sm text-secondary-500 font-medium">
            Total Records: {historyRequests.length}
          </span>
        </div>

        <div className="space-y-4">
          {historyRequests.length === 0 ? (
            <Card className="text-center py-12 border-none shadow-sm bg-white">
              <History className="mx-auto text-secondary-300 mb-3" size={48} />
              <p className="text-secondary-500 text-lg">No service records found.</p>
              <p className="text-secondary-400 text-sm mt-1">Accept requests from your notifications to see them here.</p>
            </Card>
          ) : (
            historyRequests.map((req) => (
              <Card key={req.id} className="p-5 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-all border-none shadow-sm group bg-white">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-secondary-900 text-lg group-hover:text-primary-600 transition-colors">
                      {req.title || "Service Request"}
                    </h3>
                    <Badge variant={req.status === 'ACCEPTED' ? 'primary' : req.status === 'COMPLETED' ? 'success' : 'danger'}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-secondary-500">
                    <p><span className="font-semibold text-secondary-700">Client:</span> {req.requestedBy}</p>
                    <p><span className="font-semibold text-secondary-700">Price:</span> ₹{req.price || 0}</p>
                    <p className="sm:col-span-2"><span className="font-semibold text-secondary-700">Address:</span> {req.address || "No address provided"}</p>
                    {req.acceptedAt && (
                      <p className="sm:col-span-2">
                        <span className="font-semibold text-secondary-700">Started:</span> {new Date(req.acceptedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;

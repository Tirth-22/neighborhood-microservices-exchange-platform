import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Check, X, Shield, Users } from "lucide-react";
import { providerApi } from "../api/providerApi";

const AdminDashboard = () => {
    const [providers, setProviders] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');

    const fetchProviders = async () => {
        try {
            const response = await providerApi.getAllProviders(activeTab === 'pending' ? 'PENDING' : '');
            setProviders(response.data);
        } catch (error) {
            console.error("Failed to fetch providers", error);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, [activeTab]);

    const handleApprove = async (id) => {
        try {
            await providerApi.approveProvider(id);
            fetchProviders();
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleReject = async (id) => {
        try {
            await providerApi.rejectProvider(id);
            fetchProviders();
        } catch (error) {
            console.error("Failed to reject", error);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-3">
                    <Shield className="text-primary-600" size={32} />
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Admin Dashboard</h1>
                        <p className="text-secondary-600">Manage platform providers and users.</p>
                    </div>
                </div>

                <div className="mb-6 flex space-x-4 border-b border-secondary-200">
                    <button
                        className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-primary-600 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Approvals
                    </button>
                    <button
                        className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-primary-600 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Providers
                    </button>
                </div>

                <div className="grid gap-4">
                    {providers.length === 0 ? (
                        <Card className="p-8 text-center text-secondary-500">
                            No providers found.
                        </Card>
                    ) : (
                        providers.map(provider => (
                            <Card key={provider.id} className="p-6 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-secondary-900">{provider.username}</h3>
                                        <Badge variant={provider.status === 'ACTIVE' ? 'success' : provider.status === 'PENDING' ? 'warning' : 'danger'}>
                                            {provider.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-secondary-500">Service Type: {provider.serviceType}</p>
                                </div>

                                {provider.status === 'PENDING' && (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleApprove(provider.id)} className="bg-green-600 hover:bg-green-700">
                                            <Check size={16} className="mr-1" /> Approve
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => handleReject(provider.id)}>
                                            <X size={16} className="mr-1" /> Reject
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

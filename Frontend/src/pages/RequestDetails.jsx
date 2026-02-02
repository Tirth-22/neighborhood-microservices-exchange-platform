import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestApi } from '../api/requestApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Calendar, Clock, MapPin, User, ArrowLeft, CreditCard } from 'lucide-react';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await requestApi.getRequestById(id);
        setRequest(response.data);
      } catch (error) {
        console.error("Failed to fetch request details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <Card className="p-8 text-center bg-white border-none shadow-lg">
          <p className="text-secondary-500 mb-4">Request not found</p>
          <Button onClick={() => navigate('/my-requests')}>Back to Requests</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-secondary-600 hover:text-secondary-900 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to list
        </button>

        <Card className="bg-white overflow-hidden border-secondary-200">
          {/* Header */}
          <div className="bg-secondary-50 border-b border-secondary-200 p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">{request.serviceName}</h2>
              <p className="text-secondary-500 text-sm mt-1">Request ID: #{request.id}</p>
            </div>
            <Badge variant={getStatusVariant(request.status)} className="px-4 py-1.5 text-sm uppercase tracking-wider">
              {request.status}
            </Badge>
          </div>

          <div className="p-8">
            <div className="mb-8 font-serif">
              <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-secondary-600 leading-relaxed bg-secondary-50 p-4 rounded-lg">
                {request.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-start">
                <User className="text-primary-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm font-medium text-secondary-500">Provider</p>
                  <p className="text-secondary-900 font-medium">{request.provider || "Not assigned"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="text-primary-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm font-medium text-secondary-500">Address</p>
                  <p className="text-secondary-900">{request.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="text-primary-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm font-medium text-secondary-500">Date</p>
                  <p className="text-secondary-900">{request.date}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="text-primary-500 mt-1 mr-3" size={20} />
                <div>
                  <p className="text-sm font-medium text-secondary-500">Time</p>
                  <p className="text-secondary-900">{request.time}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-secondary-100 pt-6 mt-2">
              <div className="flex items-center">
                <CreditCard className="text-primary-500 mr-3" size={20} />
                <div>
                  <p className="text-sm font-medium text-secondary-500">Payment Method</p>
                  <p className="text-secondary-900 font-medium">{request.payment}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RequestDetails;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { ArrowLeft, User, Calendar, Clock, MapPin, IndianRupee, CreditCard } from "lucide-react";

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem("requests")) || [];

    const foundRequest = storedRequests.find(
      (req) => req.id === Number(id)
    );

    setRequest(foundRequest);
  }, [id]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Accepted": return "primary";
      case "Completed": return "success";
      case "Cancelled": return "danger";
      default: return "default";
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <Card className="p-8 text-center">
          <p className="text-secondary-500 mb-4">Request not found</p>
          <Button onClick={() => navigate('/my-requests')}>Back to Requests</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary-600"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>

        <Card className="bg-white overflow-hidden">
          {/* Header */}
          <div className="bg-secondary-50 border-b border-secondary-200 p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">{request.serviceName}</h2>
              <p className="text-secondary-500 text-sm mt-1">Request ID: #{request.id}</p>
            </div>
            <Badge variant={getStatusVariant(request.status)} className="px-3 py-1 text-sm">{request.status}</Badge>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-secondary-600 leading-relaxed bg-secondary-50 p-4 rounded-lg">
                {request.description || "No description provided."}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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

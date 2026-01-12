import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem("requests")) || [];

    const foundRequest = storedRequests.find(
      (req) => req.id === Number(id)
    );

    
    setRequest(foundRequest);
  }, [id]);

  if (!request) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Request not found
      </p>
    );
  }

  return (
    <div className="max-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 border rounded">

        <h2 className="text-xl font-semibold mb-4">
          Service Request Details
        </h2>

        <div className="space-y-2 text-l">
          <p><b>Request ID:</b> {request.id}</p>
          <p><b>Service:</b> {request.serviceName}</p>
          <p><b>Provider:</b> {request.provider || "Not assigned"}</p>
          <p><b>Status:</b> {request.status}</p>
          <p><b>Date:</b> {request.date}</p>
          <p><b>Address:</b> {request.address}</p>
          <p><b>Payment:</b> {request.payment}</p>
        </div>

      </div>
    </div>
  );
};

export default RequestDetails;

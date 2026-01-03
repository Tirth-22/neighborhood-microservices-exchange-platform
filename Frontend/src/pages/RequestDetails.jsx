import { useParams } from "react-router-dom";

const RequestDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

        <h2 className="text-2xl font-bold mb-4">
          Service Request Details
        </h2>

        <p><b>Request ID:</b> {id}</p>
        <p><b>Service:</b> Plumber</p>
        <p><b>Provider:</b> Rahul Sharma</p>
        <p><b>Status:</b> Pending</p>
        <p><b>Date:</b> 2025-01-02</p>
        <p><b>Address:</b> 12, ABC Society</p>
        <p><b>Payment:</b> Cash</p>

      </div>
    </div>
  );
};

export default RequestDetails;

const OfferService = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Offer a Service
        </h2>

        {/* Service Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Service Name
          </label>
          <input
            type="text"
            placeholder="e.g. Plumbing, Home Tutor"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Category
          </label>
          <select className="w-full border rounded px-3 py-2">
            <option>Select category</option>
            <option>Plumber</option>
            <option>Electrician</option>
            <option>Tutor</option>
            <option>Cleaner</option>
            <option>Delivery</option>
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Price (per hour)
          </label>
          <input
            type="number"
            placeholder="₹ Amount"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Availability */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Availability
          </label>
          <select className="w-full border rounded px-3 py-2">
            <option>Select availability</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Full Day</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Service Description
          </label>
          <textarea
            rows="4"
            placeholder="Describe your service experience..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
          Publish Service
        </button>

      </div>
    </div>
  );
};

export default OfferService;

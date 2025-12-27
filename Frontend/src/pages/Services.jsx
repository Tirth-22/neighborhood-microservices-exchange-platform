import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const Services = () => {
  return (
  <div> 
    <div className="max-w-7xl mx-auto px-6 py-10 ">
      <h2 className="text-3xl font-bold mb-6">Available Services</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold">Plumber</h3>
            <p className="text-gray-600">₹300 / hour</p>

            <Link
              to="/request-service"
              className="block text-center mt-4 bg-blue-600 text-white py-2 rounded"
            >
              Request Service
            </Link>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Services;

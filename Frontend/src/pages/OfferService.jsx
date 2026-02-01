import { useState } from "react";
import { providerApi } from "../api/providerApi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OfferService = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    serviceName: "",
    category: "",
    price: "",
    availability: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Map frontend category to backend Enum
      const categoryMap = {
        "Plumbing": "PLUMBER",
        "Electrical": "ELECTRICIAN",
        "Teaching": "OTHER", // Or add TEACHER to backend if needed
        "Cleaning": "CLEANING",
        "Delivery": "OTHER", // Or add DELIVERY
        "Other": "OTHER"
      };

      const backendCategory = categoryMap[formData.category] || "OTHER";

      const payload = {
        name: formData.serviceName, // Service Title (e.g. "Home Cleaning")
        description: formData.description || "No description provided.",
        price: parseFloat(formData.price),
        category: backendCategory
      };

      await providerApi.createService(payload);
      alert("Service Created Successfully!");
      navigate("/services");
    } catch (error) {
      console.error("Failed to create service", error);
      alert("Failed to offer service: " + (error.response?.data?.message || error.message));
    }
  };

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

        <Card className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-secondary-900">Offer a Service</h2>
            <p className="text-secondary-500 mt-2">Become a provider and start earning.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name
                </label>
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Title / Category
              </label>
              <input
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                placeholder="e.g. Professional Plumbing, Math Tutor"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Type
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Teaching">Teaching</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Delivery">Delivery</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (per hour)
                </label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹ Amount"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select availability</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Full Day">Full Day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              <Button className="w-full py-3 text-base" onClick={handleSubmit}>
                Publish Service
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OfferService;

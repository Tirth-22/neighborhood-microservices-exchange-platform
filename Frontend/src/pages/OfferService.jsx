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
              <Input
                label="Provider Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <Input
              label="Service Title / Category"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="e.g. Professional Plumbing, Math Tutor"
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Category Type
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full relative z-10 rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option>Select category</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Teaching</option>
                <option>Cleaning</option>
                <option>Delivery</option>
                <option>Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price (per hour)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="₹ Amount"
                className="relative z-10"
              />

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full relative z-10 rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option>Select availability</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Full Day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Service Description
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service experience, qualifications, and what you offer..."
                className="w-full relative z-10 rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

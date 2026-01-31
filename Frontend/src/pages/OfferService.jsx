import { useState } from "react";
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

  const handleSubmit = () => {
    const newService = {
      id: Date.now(),
      name: formData.name, // Provider Name
      email: formData.email,
      category: formData.category === "Select category" ? formData.serviceName : formData.category, // Use category or custom name if needed, aligning with ServiceCard expectation
      // Actually ServiceCard uses 'category' for the tag and 'name' for the provider name? 
      // Let's check ServiceCard. 
      // ServiceCard: {service.name} is displayed as the main title? No.
      // ServiceCard line 18: {service.name} is the Title.
      // ServiceCard line 14: {service.category} is the Badge.
      // Wait, in previous mock data: name="Tirth", category="IT-DSA".
      // So 'name' is the Provider Name? Or Service Name?
      // "Tirth" sounds like Provider Name. "IT-DSA" is category.
      // Let's look at RequestService.jsx:
      // provider: selectedService?.name
      // serviceName: selectedService?.category
      // So 'name' IS the Provider Name.
      // And 'category' is the Service Name/Type.

      // So we should map:
      // service.name = formData.name (Provider Name)
      // service.category = formData.serviceName (The actual service title, e.g. "Plumbing Repair")

      // Wait, existing data: category="IT-DSA", name="Tirth".
      // If I offer "Plumbing", category should be "Plumbing". name should be "Tirth".

      name: formData.name,
      category: formData.serviceName, // Using 'serviceName' input as the main Category/Service Title
      price: formData.price,
      providerId: currentUser?.id || "guest_provider_" + Date.now(),
      description: formData.description
    };

    const existingServices = JSON.parse(localStorage.getItem("services")) || [];
    existingServices.push(newService);
    localStorage.setItem("services", JSON.stringify(existingServices));
    navigate("/services");
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
                className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
              />

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
                className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

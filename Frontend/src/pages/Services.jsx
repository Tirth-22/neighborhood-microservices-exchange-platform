import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import { providerApi } from "../api/providerApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Search, Filter } from "lucide-react";

const Services = () => {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await providerApi.getAllServices();
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const navigate = useNavigate();
  const handleRequest = (service) => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    localStorage.setItem("selectedService", JSON.stringify(service))
    navigate(`/request-service?serviceId=${service.id}`)
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900">Available Services</h2>
            <p className="text-secondary-500 mt-1">Find the best local experts for your needs.</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-2.5 text-secondary-400" size={18} />
              <input
                type="text"
                placeholder="Search services..."
                className="pl-9 pr-4 py-2 rounded-lg border border-secondary-300 w-full md:w-64 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <Button variant="secondary" className="flex items-center gap-2">
              <Filter size={18} /> Filter
            </Button>
          </div>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onRequest={handleRequest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-secondary-500">No services found matching your criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Services;

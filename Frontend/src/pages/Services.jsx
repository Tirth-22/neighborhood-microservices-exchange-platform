import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import ServiceCard from "../components/ServiceCard";

const Services = () => {

  const services = [
    {
      id: 1,
      name: "Tirth",
      category: "IT-DSA",
      price: "1000",
      providerId:"provider_tirth"
    }, {
      id: 2,
      name: "Harshit",
      category: "IT-python",
      price: "800",
      providerId:"provider_harshit"
    },
    {
      id: 3,
      name: "Rushil",
      category: "construction issue",
      price: "700",
      providerId:"provider_rushil"
    },
    {
      id: 4,
      name: "Yash",
      category: "Electric",
      price: "700",
      providerId:"provider_yash"
    }
  ]

  const navigate = useNavigate();
  const handleRequest = (service) => {
    localStorage.setItem("selectedService",JSON.stringify(service))
    navigate(`/request-service?serviceId=${service}`)
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-10 ">
        <h2 className="text-3xl font-bold mb-6">Available Services</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => {
            console.log("SERVICES:", services);
            return (
              <ServiceCard
                key={service.id}
                service={service}
                onRequest={handleRequest}
              />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;

import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import { providerApi } from "../api/providerApi";
import Button from "../components/ui/Button";
import { Search, Filter, X } from "lucide-react";
import { categories as allCategories } from "../components/CategoryGrid";

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ---- ROLE CHECK (SINGLE SOURCE) ----
  const getRole = (u) => {
    if (!u) return "";
    let r = u.role || u.roles || u.authorities || "";
    if (Array.isArray(r)) r = r[0];
    if (typeof r === "object" && r !== null)
      r = r.name || r.authority || "";
    return String(r || "").toLowerCase().trim();
  };

  const isProvider = getRole(currentUser).includes("provider");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await providerApi.getAllServices();
        // Remove duplicates by service id
        const uniqueServices = response.data.filter((service, index, self) =>
          index === self.findIndex((s) => s.id === service.id)
        );
        setServices(uniqueServices);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Get category display name
  const getCategoryName = (value) => {
    const cat = allCategories.find(c => c.value === value);
    return cat ? cat.name : value;
  };

  const categories = ["All", ...new Set(services.map(s => s.category || "Other"))];

  const filteredServices = services.filter(service => {
    const providerName = service.providerName || "";
    const category = service.category || "";
    const name = service.name || "";
    const description = service.description || "";

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleRequest = (service) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    localStorage.setItem("selectedService", JSON.stringify(service));
    navigate(`/request-service?serviceId=${service.id}`);
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900">
              {selectedCategory !== "All" ? getCategoryName(selectedCategory) : "All Services"}
            </h2>
            <p className="text-secondary-500 mt-1">
              {filteredServices.length} services available
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search
                className="absolute left-3 top-2.5 text-secondary-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-secondary-200 bg-white text-secondary-900 placeholder-secondary-400 w-full md:w-64 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-xl border border-secondary-200 bg-white text-secondary-900 appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm cursor-pointer w-full"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === "All" ? "All Categories" : getCategoryName(cat)}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-2.5 text-secondary-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "All" || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-secondary-500">Active filters:</span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {getCategoryName(selectedCategory)}
                <button onClick={() => setSelectedCategory("All")} className="hover:text-primary-900">
                  <X size={14} />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="hover:text-secondary-900">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-secondary-500 font-medium">Loading amazing services...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isProvider={isProvider}
                onRequest={handleRequest}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-secondary-100 transition-all duration-300">
            <div className="bg-secondary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-secondary-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-secondary-900 mb-1">No services matched</h3>
            <p className="text-secondary-500 max-w-xs mx-auto">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;

import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Locate, X } from 'lucide-react';

const popularCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"
];

const LocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("userLocation") || "Select Location"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  const filteredCities = popularCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("userLocation", location);
    setIsOpen(false);
    setSearchTerm("");
  };

  const detectLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In production, use a geocoding API
            // For demo, we'll just set a default
            const location = "Current Location";
            handleSelectLocation(location);
          } catch (error) {
            console.error("Error getting location:", error);
          } finally {
            setIsDetecting(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-colors"
      >
        <MapPin className="text-primary-600" size={18} />
        <span className="text-sm font-medium text-secondary-700 max-w-[120px] truncate">
          {selectedLocation}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-secondary-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-secondary-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-secondary-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <MapPin className="absolute left-3 top-2.5 text-secondary-400" size={16} />
              </div>
            </div>

            <button
              onClick={detectLocation}
              disabled={isDetecting}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors border-b border-secondary-100"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Locate className="text-primary-600" size={16} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-primary-600">
                  {isDetecting ? "Detecting..." : "Detect my location"}
                </p>
                <p className="text-xs text-secondary-500">Using GPS</p>
              </div>
            </button>

            <div className="p-2 max-h-60 overflow-y-auto">
              <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wider px-2 py-2">
                Popular Cities
              </p>
              {filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleSelectLocation(city)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary-50 transition-colors ${
                    selectedLocation === city ? 'bg-primary-50 text-primary-600 font-medium' : 'text-secondary-700'
                  }`}
                >
                  {city}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="text-sm text-secondary-500 text-center py-4">
                  No cities found
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationSelector;

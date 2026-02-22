import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { providerApi } from '../api/providerApi';
import { Link } from 'react-router-dom';
import { MapPin, Star, Filter, Search, X, Navigation } from 'lucide-react';

// Fix for Leaflet marker icons in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom colored markers
const createColoredIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "><div style="
            background: white;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
        "></div></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });
};

const categoryColors = {
    'PLUMBING': '#3B82F6',
    'ELECTRICAL': '#F59E0B',
    'CLEANING': '#10B981',
    'GARDENING': '#22C55E',
    'TUTORING': '#8B5CF6',
    'PET_CARE': '#EC4899',
    'REPAIR': '#EF4444',
    'DELIVERY': '#6366F1',
    'OTHER': '#6B7280',
};

// Component to recenter map
const RecenterButton = ({ center, zoom }) => {
    const map = useMap();
    
    const handleRecenter = () => {
        map.setView(center, zoom);
    };
    
    return (
        <button
            onClick={handleRecenter}
            className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-lg shadow-lg hover:bg-secondary-50 transition-colors"
            title="Recenter map"
        >
            <Navigation size={20} className="text-primary-600" />
        </button>
    );
};

// Component to handle user location
const UserLocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", (e) => {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 14);
        });
    }, [map]);

    return position ? (
        <Marker 
            position={position}
            icon={createColoredIcon('#3B82F6')}
        >
            <Popup>
                <div className="text-center font-medium">You are here</div>
            </Popup>
        </Marker>
    ) : null;
};

const ServiceProviderMap = ({ 
    height = "500px", 
    showFilters = true, 
    showSearch = true,
    initialCategory = null 
}) => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [center] = useState([22.3039, 70.8022]); // Default center (Rajkot, Gujarat)
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const categories = Object.keys(categoryColors);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [services, searchTerm, selectedCategory]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await providerApi.getAllServices();
            const servicesData = Array.isArray(response.data) ? response.data : [];
            // Add mock coordinates since backend doesn't provide them yet
            const servicesWithCoords = servicesData.map((s, index) => ({
                ...s,
                lat: center[0] + (Math.random() - 0.5) * 0.08,
                lng: center[1] + (Math.random() - 0.5) * 0.08,
            }));
            setServices(servicesWithCoords);
        } catch (err) {
            console.error("Failed to fetch services for map", err);
        } finally {
            setLoading(false);
        }
    };

    const filterServices = useCallback(() => {
        let filtered = [...services];
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s => 
                s.name?.toLowerCase().includes(term) ||
                s.category?.toLowerCase().includes(term) ||
                s.providerUsername?.toLowerCase().includes(term)
            );
        }
        
        if (selectedCategory) {
            filtered = filtered.filter(s => 
                s.category?.toUpperCase() === selectedCategory
            );
        }
        
        setFilteredServices(filtered);
    }, [services, searchTerm, selectedCategory]);

    const getMarkerIcon = (category) => {
        const color = categoryColors[category?.toUpperCase()] || categoryColors.OTHER;
        return createColoredIcon(color);
    };

    return (
        <div className="relative">
            {/* Search and Filter Bar */}
            {(showSearch || showFilters) && (
                <div className="mb-4 flex flex-wrap gap-3 items-center">
                    {showSearch && (
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search services on map..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    )}
                    
                    {showFilters && (
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setShowFilterPanel(!showFilterPanel)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                                    ${selectedCategory 
                                        ? 'bg-primary-50 border-primary-500 text-primary-700' 
                                        : 'border-secondary-200 text-secondary-700 hover:bg-secondary-50'
                                    }`}
                            >
                                <Filter size={18} />
                                {selectedCategory || 'All Categories'}
                            </button>
                            
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="p-2 text-secondary-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Category Filter Panel */}
            {showFilterPanel && showFilters && (
                <div className="mb-4 p-4 bg-white border border-secondary-200 rounded-xl shadow-lg">
                    <h4 className="font-medium text-secondary-900 mb-3">Filter by Category</h4>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat === selectedCategory ? null : cat);
                                    setShowFilterPanel(false);
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors
                                    ${selectedCategory === cat 
                                        ? 'bg-primary-600 text-white' 
                                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                                    }`}
                            >
                                <span 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: categoryColors[cat] }}
                                />
                                {cat.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results count */}
            <div className="mb-2 text-sm text-secondary-500">
                Showing {filteredServices.length} of {services.length} services
            </div>

            {/* Map Container */}
            <div 
                className="rounded-2xl overflow-hidden shadow-lg border border-secondary-200 relative"
                style={{ height }}
            >
                {loading && (
                    <div className="absolute inset-0 bg-white/80 z-[1000] flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-secondary-600">Loading map...</p>
                        </div>
                    </div>
                )}
                
                <MapContainer 
                    center={center} 
                    zoom={13} 
                    scrollWheelZoom={true} 
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <RecenterButton center={center} zoom={13} />
                    <UserLocationMarker />
                    
                    {filteredServices.map((service) => (
                        <Marker 
                            key={service.id} 
                            position={[service.lat, service.lng]}
                            icon={getMarkerIcon(service.category)}
                        >
                            <Popup>
                                <div className="p-2 min-w-[180px]">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-secondary-900 text-base leading-tight">
                                            {service.name}
                                        </h3>
                                        {service.averageRating && (
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star size={14} className="fill-current" />
                                                <span className="text-xs font-medium">
                                                    {service.averageRating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-1 mb-2">
                                        <span 
                                            className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                            style={{ backgroundColor: categoryColors[service.category?.toUpperCase()] || categoryColors.OTHER }}
                                        >
                                            {service.category}
                                        </span>
                                    </div>
                                    
                                    <p className="text-xs text-secondary-500 mb-3">
                                        by @{service.providerUsername}
                                    </p>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-primary-600 text-lg">
                                            ₹{service.price}
                                        </span>
                                        <Link
                                            to={`/request-service?serviceId=${service.id}`}
                                            className="text-xs bg-primary-600 !text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors no-underline font-bold"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {Object.entries(categoryColors).slice(0, 6).map(([cat, color]) => (
                    <div key={cat} className="flex items-center gap-1.5 text-xs text-secondary-600">
                        <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                        />
                        {cat.replace('_', ' ')}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceProviderMap;

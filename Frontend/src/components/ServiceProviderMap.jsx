import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { providerApi } from '../api/providerApi';
import { Link } from 'react-router-dom';

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

const ServiceProviderMap = () => {
    const [services, setServices] = useState([]);
    const [center] = useState([22.3039, 70.8022]); // Default center (e.g., Rajkot, Gujarat)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await providerApi.getAllServices();
                const servicesData = Array.isArray(response.data) ? response.data : [];
                // Add mock coordinates since backend doesn't provide them yet
                const servicesWithCoords = servicesData.map((s, index) => ({
                    ...s,
                    lat: center[0] + (Math.random() - 0.5) * 0.05,
                    lng: center[1] + (Math.random() - 0.5) * 0.05,
                }));
                setServices(servicesWithCoords);
            } catch (err) {
                console.error("Failed to fetch services for map", err);
            }
        };
        fetchServices();
    }, [center]);

    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border border-secondary-200 z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {services.map((service) => (
                    <Marker key={service.id} position={[service.lat, service.lng]}>
                        <Popup>
                            <div className="p-2 min-w-[150px]">
                                <h3 className="font-bold text-secondary-900">{service.name}</h3>
                                <p className="text-sm text-secondary-600 mb-2">{service.category}</p>
                                <p className="text-xs text-secondary-500 font-medium mb-3">by @{service.providerUsername}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-primary-600">₹{service.price}</span>
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
    );
};

export default ServiceProviderMap;

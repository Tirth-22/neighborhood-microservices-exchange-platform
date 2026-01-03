import service from '../pages/Services'

const ServiceCard = ({ service, onRequest }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold">
                {service.name}
            </h3>

            <p className="text-gray-600">
                {service.category}
            </p>

            <p className="mt-2 font-medium">
                ₹{service.price} / hour
            </p>

            <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
                onClick={() => onRequest(service)}
            >
                Request Service
            </button>
        </div>
    );
};

export default ServiceCard;

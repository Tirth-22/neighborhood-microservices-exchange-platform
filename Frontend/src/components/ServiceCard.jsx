import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { User, Tag, IndianRupee } from 'lucide-react';

const ServiceCard = ({ service, isProvider: isProviderProp, onRequest }) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // Robust role check helper fallback
    const getRole = (u) => {
        if (!u) return '';
        let r = u.role || u.roles || u.authorities || '';
        if (Array.isArray(r)) r = r[0];
        if (typeof r === 'object' && r !== null) r = r.name || r.authority || '';
        return String(r || '').toLowerCase().trim();
    };

    const isProvider = isProviderProp !== undefined ? isProviderProp : getRole(user).includes('provider');

    // Extract provider first name from providerName
    const getFirstName = (fullName) => {
        if (!fullName) return '?';
        const parts = fullName.trim().split(' ');
        return parts[0].charAt(0).toUpperCase();
    };

    const providerInitial = getFirstName(service.providerName);

    return (
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col h-full border-secondary-200 cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {providerInitial}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <Badge variant="primary" className="uppercase tracking-wider text-[10px]">
                        {service.category}
                    </Badge>
                    <span className="text-xs text-secondary-500 font-medium">
                        @{service.providerUsername}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-secondary-900 mb-2">
                {service.name}
            </h3>

            <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center text-sm text-secondary-600">
                    <Tag size={16} className="mr-2 text-secondary-400" />
                    <span>{service.category} Service</span>
                </div>

                <div className="flex items-center text-sm font-medium text-secondary-900">
                    <IndianRupee size={16} className="mr-2 text-secondary-400" />
                    <span>₹{service.price} / hour</span>
                </div>
            </div>

            <Button
                disabled={isProvider}
                variant={isProvider ? "secondary" : "primary"}
                className={`w-full mt-auto ${isProvider
                    ? "bg-secondary-50 border-secondary-200 text-secondary-500 hover:bg-secondary-50 cursor-not-allowed shadow-none"
                    : ""
                    }`}
                onClick={() => !isProvider && onRequest(service)}
                title={isProvider ? "Providers cannot request services" : ""}
            >
                {isProvider ? "Provider View Only" : "Request Service"}
            </Button>
        </Card>
    );
};

export default ServiceCard;

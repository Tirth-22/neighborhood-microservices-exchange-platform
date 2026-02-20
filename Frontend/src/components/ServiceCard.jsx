import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { User, Tag, IndianRupee, Star, Clock, Shield, CheckCircle } from 'lucide-react';
import { categories } from './CategoryGrid';

// Service images based on category
const getCategoryImage = (category) => {
    const imageMap = {
        'PLUMBER': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',
        'ELECTRICIAN': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
        'CLEANING': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
        'TEACHING': 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop',
        'PAINTING': 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
        'GARDENING': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        'CARPENTRY': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
        'COOKING': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop',
        'PET_CARE': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
        'FITNESS_TRAINING': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
        'BEAUTY_SALON': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
        'CAR_WASHING': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'HVAC_REPAIR': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    };
    return imageMap[category] || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop';
};

const ServiceCard = ({ service, isProvider: isProviderProp, onRequest }) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const getRole = (u) => {
        if (!u) return '';
        let r = u.role || u.roles || u.authorities || '';
        if (Array.isArray(r)) r = r[0];
        if (typeof r === 'object' && r !== null) r = r.name || r.authority || '';
        return String(r || '').toLowerCase().trim();
    };

    const isProvider = isProviderProp !== undefined ? isProviderProp : getRole(user).includes('provider');

    const getFirstName = (fullName) => {
        if (!fullName) return '?';
        const parts = fullName.trim().split(' ');
        return parts[0].charAt(0).toUpperCase();
    };

    const providerInitial = getFirstName(service.providerName);
    const categoryData = categories.find(c => c.value === service.category);
    const IconComponent = categoryData?.icon;

    // Generate random but consistent values for demo
    const reviewCount = service.reviewCount || Math.floor(Math.random() * 200) + 50;
    const rating = service.averageRating || (4 + Math.random()).toFixed(1);
    const originalPrice = Math.round(service.price * 1.2);
    const discount = Math.round(((originalPrice - service.price) / originalPrice) * 100);

    return (
        <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full border-secondary-200 cursor-default">
            {/* Service Image */}
            <div className="relative h-40 overflow-hidden">
                <img 
                    src={getCategoryImage(service.category)} 
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <Badge className={`${categoryData?.color || 'bg-primary-500'} text-white border-0 shadow-lg`}>
                        <span className="flex items-center gap-1">
                            {IconComponent && <IconComponent size={12} />}
                            {service.category?.replace(/_/g, ' ')}
                        </span>
                    </Badge>
                </div>

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                    </div>
                )}

                {/* Provider info overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white text-primary-600 flex items-center justify-center font-bold text-sm shadow-lg">
                        {providerInitial}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">{service.providerName || 'Provider'}</p>
                        <p className="text-white/80 text-xs">@{service.providerUsername}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2">
                    {service.name}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                        <Star size={10} className="fill-white mr-1" />
                        {rating}
                    </div>
                    <span className="text-secondary-500 text-xs">
                        ({reviewCount} reviews)
                    </span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center text-xs text-secondary-600 bg-secondary-50 px-2 py-1 rounded">
                        <Clock size={12} className="mr-1 text-secondary-400" />
                        ~45 mins
                    </div>
                    <div className="flex items-center text-xs text-secondary-600 bg-secondary-50 px-2 py-1 rounded">
                        <Shield size={12} className="mr-1 text-green-500" />
                        Verified
                    </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-xl font-bold text-secondary-900">₹{service.price}</span>
                    <span className="text-sm text-secondary-400 line-through">₹{originalPrice}</span>
                    <span className="text-xs text-secondary-500">/hr</span>
                </div>

                {/* UC Promise */}
                <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                    <CheckCircle size={14} />
                    <span className="font-medium">NeighborHub Promise</span>
                </div>

                <Button
                    disabled={isProvider}
                    variant={isProvider ? "secondary" : "primary"}
                    className={`w-full ${isProvider
                        ? "bg-secondary-50 border-secondary-200 text-secondary-500 hover:bg-secondary-50 cursor-not-allowed shadow-none"
                        : "bg-[#1a1a2e] hover:bg-[#16213e] text-white"
                        }`}
                    onClick={() => !isProvider && onRequest(service)}
                    title={isProvider ? "Providers cannot request services" : ""}
                >
                    {isProvider ? "Provider View Only" : "Book Now"}
                </Button>
            </div>
        </Card>
    );
};

export default ServiceCard;

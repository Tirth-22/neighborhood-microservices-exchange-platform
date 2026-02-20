import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Zap, BookOpen, SprayCan, Truck, PaintBucket, 
  Home, Flower2, Dog, Baby, Hammer, Package, 
  ChefHat, Shirt, ShoppingCart, Heart, Wind, 
  Cpu, Camera, Scissors, Car, Bug, Dumbbell, Sparkles, MoreHorizontal
} from 'lucide-react';

const categories = [
  { name: "Plumbing", icon: Wrench, color: "bg-blue-500", value: "PLUMBER" },
  { name: "Electrical", icon: Zap, color: "bg-yellow-500", value: "ELECTRICIAN" },
  { name: "Teaching", icon: BookOpen, color: "bg-purple-500", value: "TEACHING" },
  { name: "Cleaning", icon: SprayCan, color: "bg-cyan-500", value: "CLEANING" },
  { name: "Delivery", icon: Truck, color: "bg-orange-500", value: "DELIVERY" },
  { name: "Painting", icon: PaintBucket, color: "bg-pink-500", value: "PAINTING" },
  { name: "Home Maintenance", icon: Home, color: "bg-emerald-500", value: "HOME_MAINTENANCE" },
  { name: "Gardening", icon: Flower2, color: "bg-green-500", value: "GARDENING" },
  { name: "Pet Care", icon: Dog, color: "bg-amber-500", value: "PET_CARE" },
  { name: "Babysitting", icon: Baby, color: "bg-rose-500", value: "BABYSITTING" },
  { name: "Carpentry", icon: Hammer, color: "bg-stone-500", value: "CARPENTRY" },
  { name: "Moving", icon: Package, color: "bg-indigo-500", value: "MOVING" },
  { name: "Cooking", icon: ChefHat, color: "bg-red-500", value: "COOKING" },
  { name: "Laundry", icon: Shirt, color: "bg-sky-500", value: "LAUNDRY" },
  { name: "Grocery", icon: ShoppingCart, color: "bg-lime-500", value: "GROCERY_SHOPPING" },
  { name: "Elderly Care", icon: Heart, color: "bg-pink-600", value: "ELDERLY_CARE" },
  { name: "AC Repair", icon: Wind, color: "bg-teal-500", value: "HVAC_REPAIR" },
  { name: "Appliance Repair", icon: Cpu, color: "bg-slate-500", value: "APPLIANCE_REPAIR" },
  { name: "IT Support", icon: Cpu, color: "bg-violet-500", value: "IT_SUPPORT" },
  { name: "Photography", icon: Camera, color: "bg-fuchsia-500", value: "PHOTOGRAPHY" },
  { name: "Tailoring", icon: Scissors, color: "bg-rose-400", value: "TAILORING" },
  { name: "Car Wash", icon: Car, color: "bg-blue-600", value: "CAR_WASHING" },
  { name: "Pest Control", icon: Bug, color: "bg-red-600", value: "PEST_CONTROL" },
  { name: "Fitness", icon: Dumbbell, color: "bg-orange-600", value: "FITNESS_TRAINING" },
  { name: "Beauty & Salon", icon: Sparkles, color: "bg-pink-400", value: "BEAUTY_SALON" },
  { name: "Other", icon: MoreHorizontal, color: "bg-gray-500", value: "OTHER" },
];

const CategoryGrid = ({ limit = 12, showAll = false }) => {
  const navigate = useNavigate();
  const displayCategories = showAll ? categories : categories.slice(0, limit);

  const handleCategoryClick = (category) => {
    navigate(`/services?category=${category.value}`);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {displayCategories.map((category) => (
        <div
          key={category.value}
          onClick={() => handleCategoryClick(category)}
          className="flex flex-col items-center p-4 bg-white rounded-xl border border-secondary-100 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
          <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <category.icon className="text-white" size={28} />
          </div>
          <span className="text-sm font-medium text-secondary-700 text-center group-hover:text-primary-600 transition-colors">
            {category.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
export { categories };

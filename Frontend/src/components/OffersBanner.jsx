import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag, Percent, Gift } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: "20% OFF on First Service",
    description: "New users get 20% discount on their first booking",
    code: "WELCOME20",
    bgColor: "bg-gradient-to-r from-orange-500 to-red-500",
    icon: Gift,
  },
  {
    id: 2,
    title: "Flat ₹100 OFF on Cleaning",
    description: "Book any cleaning service and save ₹100 instantly",
    code: "CLEAN100",
    bgColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
    icon: Tag,
  },
  {
    id: 3,
    title: "Weekend Special: 15% OFF",
    description: "Valid on all services booked for weekends",
    code: "WEEKEND15",
    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Percent,
  },
  {
    id: 4,
    title: "Refer & Earn ₹200",
    description: "Invite friends and earn ₹200 for each successful referral",
    code: "REFER200",
    bgColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
    icon: Gift,
  },
];

const OffersBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const currentOffer = offers[currentIndex];
  const IconComponent = currentOffer.icon;

  return (
    <div className={`relative overflow-hidden ${currentOffer.bgColor} rounded-2xl shadow-xl`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative px-6 py-5 flex items-center justify-between">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="text-white" size={20} />
        </button>

        <div className="flex-1 flex items-center justify-center gap-4 text-white px-4">
          <div className="hidden sm:flex w-12 h-12 bg-white/20 rounded-xl items-center justify-center">
            <IconComponent size={24} />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg">{currentOffer.title}</h3>
            <p className="text-white/90 text-sm">{currentOffer.description}</p>
          </div>
          <div className="hidden md:block bg-white/20 px-4 py-2 rounded-lg">
            <span className="text-xs text-white/80">Use code</span>
            <p className="font-bold tracking-wider">{currentOffer.code}</p>
          </div>
        </div>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="text-white" size={20} />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default OffersBanner;

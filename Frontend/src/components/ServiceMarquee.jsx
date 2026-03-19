import React from 'react';

const services = [
    "Plumbing", "Electrical Work", "House Cleaning", "Gardening",
    "Tutoring", "Carpentry", "Painting", "Pet Care",
    "Grocery Delivery", "Handyman Services", "Moving Help", "Tech Support",
    "Laundry", "Car Wash", "Fitness Training", "Massage Therapy"
];

const ServiceMarquee = () => {
    return (
        <div className="py-10 sm:py-12 bg-white overflow-hidden border-y border-secondary-100 flex flex-col items-center">
            <h3 className="text-secondary-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6 sm:mb-8 text-center px-4">
                Popular Services in Your Area
            </h3>
            <div className="relative w-full px-4 sm:px-8 lg:w-[80%] mx-auto overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {/* First set of items */}
                    <div className="flex items-center">
                        {services.map((service, index) => (
                            <div
                                key={`set1-${index}`}
                                className="flex items-center mx-6 sm:mx-10 text-base sm:text-xl font-medium text-secondary-900"
                            >
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500 mr-3 sm:mr-4 opacity-70"></span>
                                {service}
                            </div>
                        ))}
                    </div>
                    {/* Duplicate set for seamless loop */}
                    <div className="flex items-center">
                        {services.map((service, index) => (
                            <div
                                key={`set2-${index}`}
                                className="flex items-center mx-6 sm:mx-10 text-base sm:text-xl font-medium text-secondary-900"
                            >
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500 mr-3 sm:mr-4 opacity-70"></span>
                                {service}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceMarquee;

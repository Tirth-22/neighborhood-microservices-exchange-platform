import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { User, Tag, IndianRupee } from 'lucide-react';

const ServiceCard = ({ service, onRequest }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    return (
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col h-full border-secondary-200 cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <User size={24} />
                </div>
                <Badge variant="primary" className="uppercase tracking-wider text-[10px]">{service.category}</Badge>
            </div>

            <h3 className="text-xl font-bold text-secondary-900 mb-2">
                {service.name}
            </h3>

            <div className="space-y-3 mb-6 flex-grow ">
                <div className="flex items-center text-sm text-secondary-600">
                    <Tag size={16} className="mr-2 text-secondary-400" />
                    <span>{service.category} Service</span>
                </div>
                <div className="flex items-center text-sm font-medium text-secondary-900">
                    <IndianRupee size={16} className="mr-2 text-secondary-400" />
                    <span>₹{service.price} / hour</span>
                </div>
            </div>

            {currentUser?.role !== 'provider' ? (
                <Button
                    variant="primary"
                    className="w-full mt-auto"
                    onClick={() => onRequest(service)}
                >
                    Request Service
                </Button>
            ) : (
                <div className="w-full mt-auto p-2 bg-secondary-50 text-secondary-500 text-sm text-center rounded-lg border border-secondary-200">
                    Provider View Only
                </div>
            )}
        </Card>
    );
};

export default ServiceCard;

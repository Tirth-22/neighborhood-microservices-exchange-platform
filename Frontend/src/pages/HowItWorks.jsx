import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, UserPlus, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // Robust role check helper
    const getRole = (u) => {
        if (!u) return '';
        let r = u.role;
        if (Array.isArray(r)) r = r[0];
        if (typeof r === 'object' && r !== null) r = r.name || r.authority || '';
        return String(r || '').toLowerCase().trim();
    };
    const isProvider = getRole(user).includes('provider');

    const steps = [
        {
            icon: UserPlus,
            title: "1. Create an Account",
            description: "Sign up for free. Tell us a bit about yourself and where you live to see local services."
        },
        {
            icon: Search,
            title: "2. Find a Service",
            description: "Browse through categories or search for specific help like 'plumber' or 'dog walker'."
        },
        {
            icon: Calendar,
            title: "3. Book & Schedule",
            description: "Choose a provider, pick a time that works for you, and place your request."
        },
        {
            icon: CheckCircle,
            title: "4. Get it Done",
            description: "The provider completes the job. You pay securely and rate their service."
        }
    ];

    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-secondary-900 mb-6">How NeighborHub Works</h1>
                    <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                        We've made it simple to get things done. Whether you need help or want to offer it, here's how to get started.
                    </p>
                </div>

                {/* Visual Workflow */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 rounded-full -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-full border-4 border-primary-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    <step.icon className="text-primary-600 w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900 mb-3">{step.title}</h3>
                                <p className="text-secondary-600 leading-relaxed text-sm px-2">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* For Providers Section */}
                {!isProvider && (
                    <div className="mt-24">
                        <Card className="bg-primary-600 text-white p-12 text-center rounded-3xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-6">Want to earn money?</h2>
                                <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                                    Apply to become a provider. List your skills, set your prices, and start getting requests from your neighbors.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Link to="/offer-service">
                                        <Button className="bg-white text-primary-600 hover:bg-primary-50 border-none">
                                            Become a Provider
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HowItWorks;

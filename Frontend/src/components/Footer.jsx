import React from 'react';
import { Link } from 'react-router-dom';
import { House } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-secondary-200 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Column 1: Brand */}
                    <div className="flex flex-col items-start space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <House className="text-white" size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-lg font-bold text-secondary-900">NeighborHub</span>
                        </div>
                        <p className="text-sm text-secondary-500 leading-relaxed max-w-xs">
                            Connecting neighbors with trusted local services. Safe, fast, and community-driven.
                        </p>
                        <div className="text-sm text-secondary-400 pt-2">
                            &copy; {new Date().getFullYear()} NeighborHub.
                        </div>
                    </div>

                    {/* Column 2: Platform */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-semibold text-secondary-900">Platform</h3>
                        <div className="flex flex-col space-y-2">
                            <Link to="/" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">Home</Link>
                            <Link to="/how-it-works" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">How it Works</Link>
                            <Link to="/services" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">Browse Services</Link>
                            <Link to="/offer-service" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">Become a Provider</Link>
                        </div>
                    </div>

                    {/* Column 3: Support */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-semibold text-secondary-900">Support</h3>
                        <div className="flex flex-col space-y-2">
                            <Link to="/help" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">Help Center</Link>
                            <Link to="/faq" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">FAQs</Link>
                            <Link to="/privacy" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">Privacy Policy</Link>
                            <Link to="/terms" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">Terms of Service</Link>
                            <Link to="/contact" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors w-fit">Contact Us</Link>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;

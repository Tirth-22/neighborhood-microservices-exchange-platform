import { Github, Twitter, Linkedin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-secondary-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">N</span>
                            </div>
                            <span className="text-xl font-bold text-secondary-900">
                                NeighborHub
                            </span>
                        </Link>
                        <p className="text-secondary-500 text-sm leading-relaxed">
                            Connecting local experts with neighbors to build a stronger,
                            more helpful community together.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-secondary-900 uppercase tracking-wider mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-2">
                            <li><Link to="/services" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">Services</Link></li>
                            <li><Link to="/how-it-works" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">How It Works</Link></li>
                            <li><Link to="/signup" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">Join as Provider</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-secondary-900 uppercase tracking-wider mb-4">
                            Company
                        </h4>
                        <ul className="space-y-2">
                            <li><Link to="/terms" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-secondary-900 uppercase tracking-wider mb-4">
                            Connect
                        </h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-secondary-50 text-secondary-500 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 bg-secondary-50 text-secondary-500 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all">
                                <Github size={20} />
                            </a>
                            <a href="#" className="p-2 bg-secondary-50 text-secondary-500 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-secondary-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-secondary-400 text-xs">
                        © {new Date().getFullYear()} NeighborHub. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-secondary-400 text-xs">
                        Build with <Heart size={12} className="text-red-500 fill-red-500" /> in Neighborhood
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

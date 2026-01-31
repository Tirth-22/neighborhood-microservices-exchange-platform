import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Search, MapPin, ArrowRight, Shield, Clock, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Providers",
      description: "All our service providers are verified neighbors you can trust."
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Get help when you need it with our fast matching system."
    },
    {
      icon: ThumbsUp,
      title: "Quality Service",
      description: "Rate and review services to maintain high community standards."
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-32 flex flex-col items-center text-center">

          <div className="flex items-center gap-2 mb-6 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
            </span>
            <span className="text-primary-600 text-xs font-bold tracking-widest uppercase">Active Now</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 tracking-tight mb-6">
            Find Trusted Services <br className="hidden md:block" /> in Your <span className="text-primary-600">Neighborhood</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 mb-10 max-w-2xl">
            Connect with verified local experts for plumbing, electrical work, cleaning, and more.
            Safe, fast, and community-driven.
          </p>

          <Card className="p-4 w-full max-w-3xl flex flex-col md:flex-row gap-4 shadow-lg border-none bg-white/50 backdrop-blur-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-secondary-400" size={20} />
              <input
                type="text"
                placeholder="What service do you need?"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 text-secondary-400" size={20} />
              <input
                type="text"
                placeholder="Zip Code or Area"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              />
            </div>
            <Button size="lg" className="md:w-auto w-full">
              Search
            </Button>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Why Choose NeighborHub?</h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">We make it safe and easy to find help right around the corner.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-secondary-100 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to offer your skills?</h2>
              <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of neighbors earning money by helping others.
                Sign up as a provider today and start getting requests.
              </p>
              <Link to="/offer-service">
                <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors inline-flex items-center gap-2">
                  Become a Provider <ArrowRight size={18} />
                </button>
              </Link>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

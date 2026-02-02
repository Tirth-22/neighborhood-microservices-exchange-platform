import React from 'react';
import Card from '../components/ui/Card';
import { HelpCircle, FileText, MessageCircle } from 'lucide-react';

const HelpCenter = () => {
    const faqs = [
        { q: "How do I request a service?", a: "Go to the Services page, search for a provider, and click 'Request Service'." },
        { q: "Is payment secure?", a: "Yes, we support secure online payments and cash on delivery." },
        { q: "How can I become a provider?", a: "Click on 'Offer Service' in the menu or 'Become a Provider' on the home page." },
    ];

    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-secondary-900 mb-4">How can we help?</h1>
                    <p className="text-lg text-secondary-600">Find answers to common questions or contact support.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6 text-center hover:shadow-md transition-shadow bg-white border-secondary-200">
                        <HelpCircle className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 text-secondary-900">FAQs</h3>
                        <p className="text-sm text-secondary-500">Common questions answered</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-md transition-shadow bg-white border-secondary-200">
                        <FileText className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 text-secondary-900">Guides</h3>
                        <p className="text-sm text-secondary-500">Step-by-step tutorials</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-md transition-shadow bg-white border-secondary-200">
                        <MessageCircle className="w-10 h-10 text-primary-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2 text-secondary-900">Support</h3>
                        <p className="text-sm text-secondary-500">Get in touch with us</p>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-6">Frequently Asked Questions</h2>
                    {faqs.map((faq, index) => (
                        <Card key={index} className="p-6 bg-white border-secondary-200">
                            <h3 className="text-lg font-semibold text-secondary-900 mb-2">{faq.q}</h3>
                            <p className="text-secondary-600">{faq.a}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;

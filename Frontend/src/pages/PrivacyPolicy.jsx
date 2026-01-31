import React from 'react';
import Card from '../components/ui/Card';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Card className="p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8 border-b border-secondary-200 pb-4">Privacy Policy</h1>

                    <div className="space-y-6 text-secondary-700 leading-relaxed">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <p>
                            At NeighborHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">1. Information We Collect</h2>
                        <p>
                            We may collect personal information such as your name, email address, address, and payment information when you register or request a service.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to facilitate service requests, process payments, and improve our platform's user experience.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">3. Sharing of Information</h2>
                        <p>
                            We do not sell, trade, or otherwise transfer your personal information to outside parties except as necessary to provide our services (e.g., sharing address with a provider).
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">4. Data Security</h2>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

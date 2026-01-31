import React from 'react';
import Card from '../components/ui/Card';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Card className="p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8 border-b border-secondary-200 pb-4">Terms of Service</h1>

                    <div className="space-y-6 text-secondary-700 leading-relaxed">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <p>
                            Please read these Terms of Service carefully before using NeighborHub. By accessing or using our service, you agree to be bound by these terms.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">2. User Responsibilities</h2>
                        <p>
                            Users are responsible for maintaining the confidentiality of their account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">3. Service Provider Conduct</h2>
                        <p>
                            Service providers must provide accurate information about their services and qualifications. We reserve the right to remove any provider who violates our community standards.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">4. Limitation of Liability</h2>
                        <p>
                            NeighborHub shall not be liable for any indirect, incidental, special, consequential or punitive damages result from your use of the service.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TermsOfService;

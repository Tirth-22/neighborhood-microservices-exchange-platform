import Card from "../components/ui/Card";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-8 md:p-12 bg-white border-secondary-200">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8 border-b border-secondary-200 pb-4">Terms of Service</h1>

                    <div className="space-y-6 text-secondary-700 leading-relaxed">
                        <p>
                            Last updated: February 2024
                        </p>

                        <p>
                            Welcome to NeighborHub. By using our services, you agree to these terms. Please read them carefully.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the NeighborHub platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">2. User Responsibilities</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">3. Service Provider Conduct</h2>
                        <p>
                            Service providers must provide accurate information about their services and maintain professional standards of conduct. NeighborHub reserves the right to remove any provider for any reason.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">4. Limitation of Liability</h2>
                        <p>
                            NeighborHub is not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TermsOfService;

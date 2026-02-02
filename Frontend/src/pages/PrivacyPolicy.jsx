import Card from "../components/ui/Card";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-8 md:p-12 bg-white border-secondary-200">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-8 border-b border-secondary-200 pb-4">Privacy Policy</h1>

                    <div className="space-y-6 text-secondary-700 leading-relaxed">
                        <p>
                            NeighborHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, request a service, or communicate with us. This may include your name, email address, phone number, and address.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, communicate with you about your account and service requests, and personalize your experience.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">3. Sharing of Information</h2>
                        <p>
                            We share information with service providers to facilitate service requests. We do not sell your personal information to third parties.
                        </p>

                        <h2 className="text-xl font-bold text-secondary-900 mt-6">4. Data Security</h2>
                        <p>
                            We take reasonable measures to protect your information from loss, theft, misuse, and unauthorized access.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

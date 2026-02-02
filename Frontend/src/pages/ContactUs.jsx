import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-secondary-900 mb-4">Get in Touch</h1>
                    <p className="text-lg text-secondary-600">We'd love to hear from you. Send us a message or visit us.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-6 flex items-start space-x-4 bg-white border-secondary-200">
                            <Mail className="text-primary-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-secondary-900">Email</h3>
                                <p className="text-secondary-600 text-sm">support@neighborhub.com</p>
                            </div>
                        </Card>
                        <Card className="p-6 flex items-start space-x-4 bg-white border-secondary-200">
                            <Phone className="text-primary-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-secondary-900">Phone</h3>
                                <p className="text-secondary-600 text-sm">+1 (555) 123-4567</p>
                            </div>
                        </Card>
                        <Card className="p-6 flex items-start space-x-4 bg-white border-secondary-200">
                            <MapPin className="text-primary-600 mt-1" />
                            <div>
                                <h3 className="font-semibold text-secondary-900">Office</h3>
                                <p className="text-secondary-600 text-sm">123 Neighborhood Lane<br />Community City, ST 12345</p>
                            </div>
                        </Card>
                    </div>

                    <Card className="md:col-span-2 p-8 bg-white border-secondary-200">
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="text-green-600" size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-secondary-900 mb-2">Message Sent!</h2>
                                <p className="text-secondary-600">Thanks for reaching out. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-xl font-bold text-secondary-900">Send us a message</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input label="Name" placeholder="Your name" required />
                                    <Input label="Email" type="email" placeholder="Your email" required />
                                </div>
                                <Input label="Subject" placeholder="How can we help?" required />
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">Message</label>
                                    <textarea
                                        rows="4"
                                        className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-secondary-900 appearance-none"
                                        placeholder="Tell us more..."
                                        required
                                    />
                                </div>
                                <Button type="submit" size="lg" className="w-full sm:w-auto">Send Message</Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is NeighborHub?",
            answer: "NeighborHub is a platform that connects neighbors who need help with services like plumbing, cleaning, or tutoring with trusted local providers."
        },
        {
            question: "Is it free to join?",
            answer: "Yes! Signing up as a user or a provider is completely free. We only charge a small platform fee on successful transactions."
        },
        {
            question: "How do I pay for services?",
            answer: "You can pay securely online using credit/debit cards or choose cash on delivery if the provider accepts it. You can also use our 'Service Exchange' feature to swap skills!"
        },
        {
            question: "Are the providers verified?",
            answer: "Yes, we verify the identity of all our providers to ensure safety and trust within the neighborhood."
        },
        {
            question: "Can I be both a user and a provider?",
            answer: "Absolutely! You can request services when you need help and offer your own skills to earn money."
        },
        {
            question: "What happens if I'm not satisfied with a service?",
            answer: "We have a dispute resolution process. Please contact our support team within 24 hours of the service completion."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-secondary-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-secondary-600">Everything you need to know about NeighborHub.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Card
                            key={index}
                            className={`cursor-pointer transition-all duration-200 overflow-hidden bg-white ${openIndex === index ? 'ring-2 ring-primary-500' : 'hover:shadow-md'}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="p-6 flex justify-between items-center">
                                <h3 className="font-semibold text-secondary-900 text-lg">{faq.question}</h3>
                                {openIndex === index ? (
                                    <ChevronUp className="text-primary-600 min-w-[20px]" />
                                ) : (
                                    <ChevronDown className="text-secondary-400 min-w-[20px]" />
                                )}
                            </div>
                            {openIndex === index && (
                                <div className="px-6 pb-6 text-secondary-600 leading-relaxed border-t border-secondary-100 pt-4 bg-secondary-50/50">
                                    {faq.answer}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;

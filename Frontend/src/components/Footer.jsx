import React from 'react'

const Footer = () => {
    return (
        <div className="bg-gray-800 text-white py-9 max-w-full mt-32 mb-0 mx-0 px-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2024 NeighborHub. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="/privacy" className="hover:underline text-sm">Privacy Policy</a>
                <a href="/terms" className="hover:underline text-sm">Terms of Service</a>
                <a href="/contact" className="hover:underline text-sm">Contact Us</a>
            </div>
        </div>
    )
}

export default Footer

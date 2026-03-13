import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white dark:bg-[#0f172a] rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-sm dark:shadow-black/30 hover:shadow-md transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;

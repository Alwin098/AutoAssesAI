import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>}
            <input
                className={`w-full px-4 py-3 rounded-lg bg-[#051F1D] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;

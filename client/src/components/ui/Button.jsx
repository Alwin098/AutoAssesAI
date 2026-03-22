import React from 'react';
import { motion } from 'framer-motion';

const variants = {
    primary: "bg-highlight text-primary hover:brightness-110 shadow-lg shadow-highlight/20",
    secondary: "bg-muted text-white hover:brightness-110",
    outline: "bg-transparent border-2 border-muted text-secondary hover:border-highlight hover:text-highlight",
    ghost: "bg-transparent text-secondary hover:bg-accent/10",
};

const Button = ({
    children,
    variant = 'primary',
    className = '',
    loading = false,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            ) : children}
        </motion.button>
    );
};

export default Button;

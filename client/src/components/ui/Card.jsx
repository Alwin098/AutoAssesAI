import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -4, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.5)" } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-accent/10 border border-muted/30 rounded-2xl p-6 transition-colors ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;

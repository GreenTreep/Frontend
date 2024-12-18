// hero-highlight.jsx

import React from 'react';

export const HeroHighlight = ({ children, className }) => {
    return (
        <div className={`relative ${className}`}>
            {children}
        </div>
    );
};

export const Highlight = ({ children, className }) => {
    return (
        <span className={`bg-yellow-200 dark:bg-yellow-700 px-1 rounded ${className}`}>
            {children}
        </span>
    );
};

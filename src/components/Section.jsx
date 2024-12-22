// src/components/Section.jsx

import React from 'react';

const Section = ({ title, content, bgColor, children }) => {
    return (
        <section className={`py-12 ${bgColor}`}>
            <div className="container mx-auto px-4">
                <div className="w-3/4 p-6 bg-white dark:bg-black rounded-md flex justify-center shadow-md mx-auto">
                    <div className="max-w-3xl text-center">
                        <h2 className="text-3xl font-semibold mb-4">{title}</h2>
                        <p className="text-lg">{content}</p>
                    </div>
                </div>
                {children}
            </div>
        </section>
    );
};

export default Section;

// Section.jsx

import React from 'react';

const Section = ({ title, content, bgColor }) => {
    return (
        <section className={`w-full flex justify-center py-12 px-6 ${bgColor}`}>
            <div className="w-3/4 p-6 bg-white rounded-md flex justify-center shadow-md">
                <div className="max-w-3xl text-center">
                    <h2 className="text-3xl font-semibold mb-4">{title}</h2>
                    <p className="text-lg">
                        {content}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Section;

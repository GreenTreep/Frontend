import React, { useState } from 'react';

const MapSection = () => {
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState('');

    return (
        <section id="map" className="p-10 bg-green-50 rounded-lg shadow-lg mt-6">
            <h2 className="text-4xl font-semibold mb-4 text-gray-800">Planifiez votre Randonnée</h2>
            <div className="flex flex-col md:flex-row items-center mb-6">
                <div className="w-full md:w-1/2 mb-4 md:mr-4">
                    <label className="block text-gray-700 mb-2">Ville de départ</label>
                    <input
                        type="text"
                        className="border rounded-lg w-full p-2 focus:outline-none focus:ring focus:ring-green-400"
                        placeholder="Entrez votre ville de départ"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-1/2 mb-4 md:ml-4">
                    <label className="block text-gray-700 mb-2">Ville d'arrivée</label>
                    <input
                        type="text"
                        className="border rounded-lg w-full p-2 focus:outline-none focus:ring focus:ring-green-400"
                        placeholder="Entrez votre ville d'arrivée"
                        value={arrivalCity}
                        onChange={(e) => setArrivalCity(e.target.value)}
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date de départ</label>
                <input
                    type="date"
                    className="border rounded-lg w-full p-2 focus:outline-none focus:ring focus:ring-green-400"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                />
            </div>
            <div className="flex justify-center mb-8">
                <button className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg">Partir</button>
            </div>
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.3847488181107!2d-122.0838!3d37.42199999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba1c3f4d83cf%3A0xa8b40b95b2db4b2!2sGoogleplex!5e0!3m2!1sen!2sus!4v1637578340524!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
        </section>
    );
};

export default MapSection;

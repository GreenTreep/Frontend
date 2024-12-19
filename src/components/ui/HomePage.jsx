import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const MapSection = () => {
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [hikeType, setHikeType] = useState(''); // Nouvel état pour le type de randonnée

    const handleHikeType = (type) => {
        setHikeType(type);
    };

    return (
        <section id="map" className="p-10 rounded-lg shadow-lg mt-6  dark:bg-gray-900">
            <h2 className="text-4xl font-semibold mb-6 text-gray-800 dark:text-white">Planifiez votre Randonnée</h2>
            <div className="flex flex-wrap items-center mb-8 space-x-4">
                <div className="flex-1 min-w-[200px] mb-4">
                    <label className="block mb-2 text-gray-700 dark:text-gray-200">Ville de départ</label>
                    <input
                        type="text"
                        className="border border-gray-300 dark:border-gray-600 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500 transition"
                        placeholder="Entrez votre ville de départ"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                    />
                </div>
                <div className="flex-1 min-w-[200px] mb-4">
                    <label className="block mb-2 text-gray-700 dark:text-gray-200">Ville d'arrivée</label>
                    <input
                        type="text"
                        className="border border-gray-300 dark:border-gray-600 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500 transition"
                        placeholder="Entrez votre ville d'arrivée"
                        value={arrivalCity}
                        onChange={(e) => setArrivalCity(e.target.value)}
                    />
                </div>
                <div className="flex-1 min-w-[200px] mb-4">
                    <label className="block mb-2 text-gray-700 dark:text-gray-200">Date de départ</label>
                    <input
                        type="date"
                        className="border border-gray-300 dark:border-gray-600 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500 transition"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                    />
                </div>
                <div className="flex-1 min-w-[200px] mb-4">
                    <label className="block mb-2 text-green-700">Type de randonnée</label>
                    <div className="flex space-x-4">
                        <button
                            className={`p-2 rounded-full border-2 ${
                                hikeType === 'bike'
                                    ? 'bg-green-500 text-white border-green-500'
                                    : 'border-green-400 text-green-700 hover:bg-green-200'
                            } transition`}
                            onClick={() => handleHikeType('bike')}
                            aria-label="Randonnée à vélo"
                        >
                            <Icon icon="material-symbols:directions-bike" width="24" height="24" />
                        </button>
                        <button
                            className={`p-2 rounded-full border-2 ${
                                hikeType === 'hiking'
                                    ? 'bg-green-500 text-white border-green-500'
                                    : 'border-green-400 text-green-700 hover:bg-green-200'
                            } transition`}
                            onClick={() => handleHikeType('hiking')}
                            aria-label="Randonnée pédestre"
                        >
                            <Icon icon="material-symbols:hiking" width="24" height="24" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <button className="py-3 px-6 bg-green-600 text-white rounded-lg transition duration-300 shadow-lg hover:bg-green-700">
                    Partir
                </button>
            </div>

            <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ height: '50vh' }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.3847488181107!2d-122.0838!3d37.42199999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba1c3f4d83cf%3A0xa8b40b95b2db4b2!2sGoogleplex!5e0!3m2!1sen!2sus!4v1637578340524!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Google Maps"
                ></iframe>
            </div>
        </section>
    );
};

export default MapSection;

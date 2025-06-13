"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaHotel, FaCalendarAlt } from 'react-icons/fa';

export default function HebergementsPage() {
  const searchParams = useSearchParams();
  const [cities, setCities] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const citiesParam = searchParams.get('cities');
    if (citiesParam) {
      try {
        const parsedCities = JSON.parse(decodeURIComponent(citiesParam));
        setCities(parsedCities);
      } catch (error) {
        console.error('Erreur lors du parsing des villes:', error);
      }
    }
  }, [searchParams]);

  const searchHotels = async () => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date');
      return;
    }

    setLoading(true);
    const hotelsByCity = {};

    for (const city of cities) {
      try {
        // Ici, vous devrez remplacer cette URL par l'API d'hébergement de votre choix
        // Par exemple, Booking.com, Hotels.com, ou une autre API d'hébergement
        const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}&date=${selectedDate}`);
        const data = await response.json();
        hotelsByCity[city] = data;
      } catch (error) {
        console.error(`Erreur lors de la recherche d'hébergements pour ${city}:`, error);
        hotelsByCity[city] = [];
      }
    }

    setHotels(hotelsByCity);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recherche d'hébergements</h1>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <FaCalendarAlt className="text-blue-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-2"
          />
          <button
            onClick={searchHotels}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Recherche en cours...' : 'Rechercher'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {cities.map((city) => (
          <div key={city} className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaHotel className="mr-2 text-blue-500" />
              Hébergements à {city}
            </h2>
            
            {loading ? (
              <p>Chargement des hébergements...</p>
            ) : hotels[city] ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotels[city].map((hotel, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-2">{hotel.address}</p>
                    <p className="text-green-600 font-bold">{hotel.price}€</p>
                    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                      Réserver
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Sélectionnez une date et cliquez sur Rechercher pour voir les hébergements disponibles.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
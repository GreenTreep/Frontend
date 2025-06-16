"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaHotel, FaCalendarAlt, FaStar, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaFilter, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { searchHotels } from '../api/hotels';

export default function HebergementsPage() {
  const [searchParams] = useSearchParams();
  const [cities, setCities] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
  });
  const [showFilters, setShowFilters] = useState(false);

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

  const searchHotelsForCities = async () => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date');
      return;
    }

    setLoading(true);
    const hotelsByCity = {};

    for (const city of cities) {
      try {
        const data = await searchHotels(city, selectedDate);
        hotelsByCity[city] = data;
      } catch (error) {
        console.error(`Erreur lors de la recherche d'hébergements pour ${city}:`, error);
        hotelsByCity[city] = [];
      }
    }

    setHotels(hotelsByCity);
    setLoading(false);
  };

  const renderAmenities = (amenities) => {
    const amenityIcons = {
      'WiFi': <FaWifi className="text-blue-500" />,
      'Piscine': <FaSwimmingPool className="text-blue-500" />,
      'Parking': <FaParking className="text-blue-500" />,
      'Restaurant': <FaUtensils className="text-blue-500" />,
    };

    return amenities.map((amenity, index) => (
      <span key={index} className="flex items-center gap-1 mr-2">
        {amenityIcons[amenity] || amenity}
      </span>
    ));
  };

  const FilterSidebar = () => (
    <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FaFilter className="mr-2" /> Filtres
      </h3>
      
      {/* Prix */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Prix par nuit</h4>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>0€</span>
          <span>{filters.priceRange[1]}€</span>
        </div>
      </div>

      {/* Note */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Note minimale</h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFilters({ ...filters, rating: star })}
              className={`p-1 rounded ${
                filters.rating >= star ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
            >
              <FaStar className={filters.rating >= star ? 'text-white' : 'text-gray-400'} />
            </button>
          ))}
        </div>
      </div>

      {/* Équipements */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Équipements</h4>
        {['WiFi', 'Piscine', 'Parking', 'Restaurant'].map((amenity) => (
          <label key={amenity} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={filters.amenities.includes(amenity)}
              onChange={(e) => {
                const newAmenities = e.target.checked
                  ? [...filters.amenities, amenity]
                  : filters.amenities.filter((a) => a !== amenity);
                setFilters({ ...filters, amenities: newAmenities });
              }}
              className="rounded"
            />
            {amenity}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6">Recherche d'hébergements</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={cities.join(', ')}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  placeholder="Où allez-vous ?"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-lg p-2"
              />
            </div>
            <button
              onClick={searchHotelsForCities}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filtres */}
          <div className="hidden md:block">
            <FilterSidebar />
          </div>

          {/* Liste des hôtels */}
          <div className="flex-1">
            {cities.map((city) => (
              <div key={city} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  Hébergements à {city}
                </h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4">Recherche des hébergements...</p>
                  </div>
                ) : hotels[city] ? (
                  <div className="grid grid-cols-1 gap-6">
                    {hotels[city].map((hotel, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="relative h-48 md:h-auto md:w-1/3">
                            {hotel.image ? (
                              <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <FaHotel className="text-4xl text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Informations */}
                          <div className="p-6 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                                <p className="text-gray-600 mb-2">{hotel.address}</p>
                                <div className="flex items-center mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`${
                                        i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">{hotel.price}€</p>
                                <p className="text-sm text-gray-500">par nuit</p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="flex flex-wrap gap-2 mb-4">
                                {renderAmenities(hotel.amenities)}
                              </div>
                              <p className="text-sm text-gray-600 mb-4">{hotel.description}</p>
                              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Voir les disponibilités
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Sélectionnez une date et cliquez sur Rechercher pour voir les hébergements disponibles.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
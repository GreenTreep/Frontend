"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaHotel, FaCalendarAlt, FaStar, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaFilter, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { filterHotels, sortHotels } from '@/api/hotels';

export default function HebergementsPage() {
  const searchParams = useSearchParams();
  const [cities, setCities] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
    freeCancellation: false,
    stars: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');

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
        const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}&date=${selectedDate}`);
        const data = await response.json();
        hotelsByCity[city] = data;
      } catch (error) {
        console.error(`Erreur lors de la recherche d'hébergements pour ${city}:`, error);
        hotelsByCity[city] = [];
      }
    }

    const allHotelsArray = Object.values(hotelsByCity).flat();
    setAllHotels(allHotelsArray);
    applyFilters(filters, sortBy, allHotelsArray);
    setLoading(false);
  };

  const applyFilters = (currentFilters, currentSortBy, hotelsToFilter = allHotels) => {
    console.log('Application des filtres:', { 
      currentFilters, 
      currentSortBy, 
      hotelsCount: hotelsToFilter.length,
      priceRange: currentFilters.priceRange 
    });
    
    // Filtrer les hôtels
    let result = hotelsToFilter.filter(hotel => {
      // Filtre par prix
      if (currentFilters.priceRange) {
        const [minPrice, maxPrice] = currentFilters.priceRange;
        const hotelPrice = Number(hotel.price) || 0;
        console.log('Vérification prix:', { 
          hotelPrice, 
          minPrice, 
          maxPrice, 
          hotelName: hotel.name 
        });
        
        if (hotelPrice < minPrice || hotelPrice > maxPrice) {
          return false;
        }
      }

      // Filtre par note
      if (currentFilters.rating) {
        const hotelRating = Number(hotel.rating) || 0;
        if (hotelRating < currentFilters.rating) {
          return false;
        }
      }

      // Filtre par étoiles
      if (currentFilters.stars) {
        const hotelStars = Number(hotel.qualityClass) || 0;
        if (hotelStars < currentFilters.stars) {
          return false;
        }
      }

      // Filtre par annulation gratuite
      if (currentFilters.freeCancellation) {
        const hasFreeCancellation = hotel.benefitBadges?.some(badge => 
          badge.text?.toLowerCase().includes('annulation gratuite')
        );
        if (!hasFreeCancellation) {
          return false;
        }
      }

      return true;
    });

    // Trier les résultats
    result = result.sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      const ratingA = Number(a.rating) || 0;
      const ratingB = Number(b.rating) || 0;
      const distanceA = Number(a.distance) || 0;
      const distanceB = Number(b.distance) || 0;

      switch (currentSortBy) {
        case 'price_asc':
          return priceA - priceB;
        case 'price_desc':
          return priceB - priceA;
        case 'rating_desc':
          return ratingB - ratingA;
        case 'distance_asc':
          return distanceA - distanceB;
        default:
          return 0;
      }
    });

    console.log('Résultats filtrés:', { 
      count: result.length,
      firstHotel: result[0]?.name,
      firstHotelPrice: result[0]?.price
    });
    setFilteredHotels(result);
  };

  const handleFilterChange = (newFilters) => {
    console.log('Nouveaux filtres:', newFilters);
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(updatedFilters, sortBy);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    applyFilters(filters, newSortBy);
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
          step="10"
          value={filters.priceRange[1]}
          onChange={(e) => {
            const newPrice = parseInt(e.target.value);
            console.log('Nouveau prix max:', newPrice);
            handleFilterChange({ priceRange: [0, newPrice] });
          }}
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
          {[0, 7, 8, 9].map(rating => (
            <button
              key={rating}
              onClick={() => handleFilterChange({ rating })}
              className={`px-3 py-1 rounded ${
                filters.rating === rating ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {rating === 0 ? 'Tous' : `${rating}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Étoiles */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Nombre d'étoiles</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 5].map(stars => (
            <button
              key={stars}
              onClick={() => handleFilterChange({ stars })}
              className={`px-3 py-1 rounded ${
                filters.stars === stars ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {stars === 0 ? 'Tous' : '★'.repeat(stars)}
            </button>
          ))}
        </div>
      </div>

      {/* Annulation gratuite */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.freeCancellation}
            onChange={(e) => handleFilterChange({ freeCancellation: e.target.checked })}
            className="form-checkbox"
          />
          <span>Annulation gratuite</span>
        </label>
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
              onClick={searchHotels}
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
          <div className="w-1/4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Filtres</h2>
              
              {/* Filtre par prix */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Prix par nuit</h3>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const newPrice = parseInt(e.target.value);
                    console.log('Nouveau prix max:', newPrice);
                    handleFilterChange({ priceRange: [0, newPrice] });
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0€</span>
                  <span>{filters.priceRange[1]}€</span>
                </div>
              </div>

              {/* Filtre par note */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Note minimale</h3>
                <div className="flex gap-2">
                  {[0, 7, 8, 9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange({ rating })}
                      className={`px-3 py-1 rounded ${
                        filters.rating === rating ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {rating === 0 ? 'Tous' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par étoiles */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Nombre d'étoiles</h3>
                <div className="flex gap-2">
                  {[0, 3, 4, 5].map(stars => (
                    <button
                      key={stars}
                      onClick={() => handleFilterChange({ stars })}
                      className={`px-3 py-1 rounded ${
                        filters.stars === stars ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {stars === 0 ? 'Tous' : '★'.repeat(stars)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par annulation gratuite */}
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.freeCancellation}
                    onChange={(e) => handleFilterChange({ freeCancellation: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span>Annulation gratuite</span>
                </label>
              </div>
            </div>
          </div>

          {/* Liste des hôtels */}
          <div className="w-3/4">
            {/* Tri */}
            <div className="mb-4 flex justify-end">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border rounded p-2"
              >
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating_desc">Meilleures notes</option>
                <option value="distance_asc">Plus proche</option>
              </select>
            </div>

            {/* Liste des hôtels filtrés */}
            <div className="grid grid-cols-1 gap-4">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative h-48 md:h-auto md:w-1/3">
                        {hotel.image ? (
                          <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover"
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucun hôtel ne correspond à vos critères de recherche
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
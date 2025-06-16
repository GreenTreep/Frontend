"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaHotel, FaCalendarAlt, FaStar, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaFilter, FaSearch, FaMapMarkerAlt, FaTimes, FaCreditCard } from 'react-icons/fa';
import Image from 'next/image';
import { searchHotels, getHotelAvailability, getHotelPaymentFeatures } from '@/api/hotels';

// Composant Modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Détails de l'hébergement</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function HebergementsPage() {
  const searchParams = useSearchParams();
  const [cities, setCities] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [paymentFeatures, setPaymentFeatures] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const searchHotelsForCity = async () => {
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

  const loadHotelDetails = async (hotel) => {
    console.log("Chargement des détails pour l'hôtel:", hotel);
    setSelectedHotel(hotel);
    setLoadingDetails(true);
    try {
      const [availabilityData, paymentData] = await Promise.all([
        getHotelAvailability(hotel.id),
        getHotelPaymentFeatures(hotel.id)
      ]);
      console.log("Données de disponibilité:", availabilityData);
      console.log("Données de paiement:", paymentData);
      setAvailability(availabilityData);
      setPaymentFeatures(paymentData);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      alert('Erreur lors du chargement des détails de l\'hôtel');
    }
    setLoadingDetails(false);
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
            onClick={searchHotelsForCity}
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
                    <button 
                      onClick={() => loadHotelDetails(hotel)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    >
                      Voir les disponibilités
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

      {/* Modal des détails */}
      <Modal isOpen={!!selectedHotel} onClose={() => setSelectedHotel(null)}>
        {loadingDetails ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Chargement des détails...</p>
          </div>
        ) : (
          <div>
            {selectedHotel && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{selectedHotel.name}</h3>
                  <p className="text-gray-600">{selectedHotel.address}</p>
                </div>

                {/* Disponibilités */}
                {availability && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Disponibilités</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availability.rooms?.map((room, index) => (
                        <div key={index} className="border rounded p-4">
                          <h5 className="font-medium mb-2">{room.name}</h5>
                          <p className="text-green-600 font-bold mb-2">{room.price}€</p>
                          <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                          <ul className="text-sm text-gray-600">
                            {room.amenities?.map((amenity, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <FaWifi className="text-blue-500" />
                                {amenity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options de paiement */}
                {paymentFeatures && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <FaCreditCard className="mr-2" />
                      Options de paiement
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {paymentFeatures.paymentMethods?.map((method, index) => (
                        <div key={index} className="border rounded p-3">
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bouton de réservation */}
                <button 
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => {
                    window.open(selectedHotel.bookingUrl, '_blank');
                  }}
                >
                  Réserver maintenant
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 
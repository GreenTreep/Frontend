const RAPIDAPI_KEY = 'c80ac75efamsh18e48fcabfa7ed6p1bf924jsn8c106b0c0e55';
const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ';

// Cache pour stocker les résultats
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 heure

// Fonction pour générer des données d'hôtels simulées
function generateMockHotels(city) {
  const amenities = ['WiFi', 'Piscine', 'Parking', 'Restaurant', 'Spa', 'Gym', 'Bar'];
  const hotels = [];

  for (let i = 1; i <= 10; i++) {
    const rating = Math.floor(Math.random() * 3) + 3; // Note entre 3 et 5
    const price = Math.floor(Math.random() * 200) + 50; // Prix entre 50€ et 250€
    const randomAmenities = amenities
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 2); // 2 à 5 équipements aléatoires

    hotels.push({
      id: `hotel-${city}-${i}`,
      name: `${city} Hotel ${i}`,
      address: `${Math.floor(Math.random() * 100) + 1} Avenue de ${city}`,
      price: price,
      rating: rating,
      amenities: randomAmenities,
      image: `https://source.unsplash.com/800x600/?hotel,${city}`,
      description: `Un hôtel confortable situé au cœur de ${city}, offrant une vue imprenable et un service exceptionnel.`,
    });
  }

  return hotels;
}

// Fonction pour générer des données de démonstration
function generateDemoHotels(city) {
  const amenities = ['WiFi', 'Piscine', 'Parking', 'Restaurant', 'Spa', 'Gym', 'Bar'];
  const hotels = [];

  for (let i = 1; i <= 10; i++) {
    const rating = Math.floor(Math.random() * 3) + 3; // Note entre 3 et 5
    const price = Math.floor(Math.random() * 200) + 50; // Prix entre 50€ et 250€
    const randomAmenities = amenities
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 2);

    hotels.push({
      id: `hotel-${city}-${i}`,
      name: `${city} Hotel ${i}`,
      address: `${Math.floor(Math.random() * 100) + 1} Avenue de ${city}`,
      price: price,
      rating: rating,
      amenities: randomAmenities,
      image: `https://source.unsplash.com/800x600/?hotel,${city}`,
      description: `Un hôtel confortable situé au cœur de ${city}, offrant une vue imprenable et un service exceptionnel.`,
      distance: Math.floor(Math.random() * 5) + 1,
      coordinates: [0, 0], // Coordonnées fictives
      checkIn: "14:00",
      checkOut: "12:00",
      reviewCount: Math.floor(Math.random() * 1000) + 100,
      reviewScoreWord: "Excellent",
      qualityClass: Math.floor(Math.random() * 3) + 3,
      currency: "EUR",
      originalPrice: price + 20,
      currentPrice: price,
      benefitBadges: ["Petit-déjeuner inclus", "Annulation gratuite"]
    });
  }

  return hotels;
}

// Fonction pour vérifier si les données sont en cache
function getFromCache(key) {
  const cachedData = cache.get(key);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  return null;
}

// Fonction pour mettre en cache les données
function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Fonction pour obtenir les coordonnées d'une ville
async function getCityCoordinates(city) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${MAPBOX_TOKEN}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].center; // Retourne [longitude, latitude]
    }
    throw new Error('Ville non trouvée');
  } catch (error) {
    console.error('Erreur lors de la récupération des coordonnées:', error);
    throw error;
  }
}

// Fonction pour obtenir l'ID de destination
async function getDestinationId(cityName) {
  const url = new URL('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination');
  url.searchParams.append('query', cityName);
  
  const response = await fetch(url, {
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': RAPIDAPI_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la recherche de destination');
  }

  const data = await response.json();
  if (!data.data || data.data.length === 0) {
    throw new Error('Destination non trouvée');
  }

  return data.data[0].dest_id;
}

export async function searchHotels(city, date) {
  if (!city || !date) {
    throw new Error('Ville et date requises');
  }

  try {
    // Extraire uniquement le nom de la ville (avant la première virgule)
    const cityName = city.split(',')[0].trim();
    console.log('Recherche pour la ville:', cityName);

    // Obtenir l'ID de destination
    const destId = await getDestinationId(cityName);
    console.log('ID de destination:', destId);

    // Formater les dates
    const arrivalDate = new Date(date);
    const departureDate = new Date(arrivalDate);
    departureDate.setDate(departureDate.getDate() + 1);

    // Construire l'URL avec les paramètres de recherche
    const url = new URL('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels');
    url.searchParams.append('search_type', 'CITY');
    url.searchParams.append('adults', '2');
    url.searchParams.append('children_age', '0,17');
    url.searchParams.append('room_qty', '1');
    url.searchParams.append('page_number', '1');
    url.searchParams.append('units', 'metric');
    url.searchParams.append('temperature_unit', 'c');
    url.searchParams.append('languagecode', 'fr');
    url.searchParams.append('currency_code', 'EUR');
    url.searchParams.append('location', 'FR');
    url.searchParams.append('dest_id', destId);
    url.searchParams.append('arrival_date', arrivalDate.toISOString().split('T')[0]);
    url.searchParams.append('departure_date', departureDate.toISOString().split('T')[0]);

    console.log('URL de recherche:', url.toString());

    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Réponse API:', errorText);
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Données complètes de la réponse:', JSON.stringify(responseData, null, 2));

    if (!responseData.data || !responseData.data.hotels) {
      throw new Error(`Aucun hôtel trouvé pour la ville: ${cityName}`);
    }

    // Transformer les données pour correspondre à notre format
    const hotels = responseData.data.hotels.map(hotel => {
      const property = hotel.property;
      // Améliorer la qualité de l'image en modifiant l'URL
      const imageUrl = property.photoUrls?.[0]
        ? property.photoUrls[0].replace('/square60/', '/max1024x768/')
        : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80';

      return {
        id: property.id || `hotel-${Math.random()}`,
        name: property.name || 'Hôtel sans nom',
        address: property.address || 'Adresse non disponible',
        price: property.priceBreakdown?.grossPrice?.value || 0,
        rating: property.reviewScore || 0,
        amenities: property.amenities || [],
        image: imageUrl,
        description: hotel.accessibilityLabel || 'Aucune description disponible',
        distance: property.distance || 0,
        coordinates: [property.longitude, property.latitude],
        checkIn: property.checkin,
        checkOut: property.checkout,
        reviewCount: property.reviewCount || 0,
        reviewScoreWord: property.reviewScoreWord || '',
        qualityClass: property.qualityClass || 0,
        currency: property.currency || 'EUR',
        originalPrice: property.priceBreakdown?.strikethroughPrice?.value || 0,
        currentPrice: property.priceBreakdown?.grossPrice?.value || 0,
        benefitBadges: property.priceBreakdown?.benefitBadges || []
      };
    });

    return hotels;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'hébergements:', error);
    throw error;
  }
}

// Fonction pour calculer la distance entre deux points en kilomètres
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Fonction pour convertir les degrés en radians
function toRad(degrees) {
  return degrees * (Math.PI/180);
}

// Fonction pour filtrer les hôtels
export function filterHotels(hotels, filters) {
  return hotels.filter(hotel => {
    // Filtre par prix
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (hotel.price < minPrice || hotel.price > maxPrice) {
        return false;
      }
    }

    // Filtre par note
    if (filters.rating) {
      if (hotel.rating < filters.rating) {
        return false;
      }
    }

    // Filtre par équipements
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        hotel.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    // Filtre par annulation gratuite
    if (filters.freeCancellation) {
      const hasFreeCancellation = hotel.benefitBadges.some(badge => 
        badge.text?.toLowerCase().includes('annulation gratuite')
      );
      if (!hasFreeCancellation) {
        return false;
      }
    }

    // Filtre par nombre d'étoiles
    if (filters.stars) {
      if (hotel.qualityClass < filters.stars) {
        return false;
      }
    }

    return true;
  });
}

// Fonction pour trier les hôtels
export function sortHotels(hotels, sortBy) {
  return [...hotels].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating_desc':
        return b.rating - a.rating;
      case 'distance_asc':
        return a.distance - b.distance;
      default:
        return 0;
    }
  });
}

// Fonction pour obtenir les disponibilités d'un hôtel
export async function getHotelAvailability(hotelId) {
  try {
    // Données de démonstration
    const mockAvailability = {
      rooms: [
        {
          name: "Chambre Standard",
          price: 120,
          description: "Chambre confortable avec lit double",
          amenities: ["WiFi gratuit", "TV", "Climatisation", "Salle de bain privée"]
        },
        {
          name: "Suite Deluxe",
          price: 200,
          description: "Suite spacieuse avec vue panoramique",
          amenities: ["WiFi gratuit", "TV 55\"", "Mini-bar", "Bain à remous", "Vue panoramique"]
        },
        {
          name: "Chambre Familiale",
          price: 180,
          description: "Chambre familiale avec deux lits doubles",
          amenities: ["WiFi gratuit", "TV", "Climatisation", "Salle de bain privée", "Espace de travail"]
        }
      ]
    };

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAvailability;
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    throw error;
  }
}

// Fonction pour obtenir les options de paiement d'un hôtel
export async function getHotelPaymentFeatures(hotelId) {
  try {
    // Données de démonstration
    const mockPaymentFeatures = {
      paymentMethods: [
        {
          name: "Carte de crédit",
          description: "Visa, Mastercard, American Express"
        },
        {
          name: "PayPal",
          description: "Paiement sécurisé via PayPal"
        },
        {
          name: "Virement bancaire",
          description: "Paiement par virement bancaire (48h)"
        }
      ]
    };

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPaymentFeatures;
  } catch (error) {
    console.error('Erreur lors de la récupération des options de paiement:', error);
    throw error;
  }
} 
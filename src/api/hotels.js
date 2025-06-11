const RAPIDAPI_KEY = '729e950535msh1f2029a074e835dp10a6ccjsn4d6e42c5e1c9';
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
      // Extraire l'adresse de l'accessibilityLabel
      const addressMatch = hotel.accessibilityLabel.match(/À ([\d,.]+ km) du centre/);
      const distance = addressMatch ? addressMatch[1] : 'Distance non disponible';
      
      return {
        id: property.id || `hotel-${Math.random()}`,
        name: property.name || 'Hôtel sans nom',
        address: `${property.name}, ${distance} du centre de ${cityName}`,
        price: property.priceBreakdown?.grossPrice?.value || 0,
        rating: property.reviewScore || 0,
        amenities: property.amenities || [],
        image: property.photoUrls?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
        description: hotel.accessibilityLabel || 'Aucune description disponible',
        distance: distance,
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
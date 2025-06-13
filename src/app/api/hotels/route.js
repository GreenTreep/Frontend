import { NextResponse } from 'next/server';

const RAPIDAPI_KEY = '729e950535msh1f2029a074e835dp10a6ccjsn4d6e42c5e1c9';
const RAPIDAPI_HOST = 'hotels4.p.rapidapi.com';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const date = searchParams.get('date');

  if (!city || !date) {
    return NextResponse.json(
      { error: 'Ville et date requises' },
      { status: 400 }
    );
  }

  if (!RAPIDAPI_KEY) {
    return NextResponse.json(
      { error: 'Clé API non configurée' },
      { status: 500 }
    );
  }

  try {
    // Première étape : obtenir l'ID de la destination
    const searchResponse = await fetch(
      `https://hotels4.p.rapidapi.com/locations/v3/search?q=${encodeURIComponent(city)}&locale=fr_FR`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
      }
    );

    const searchData = await searchResponse.json();
    const destinationId = searchData.suggestions[0]?.entities[0]?.destinationId;

    if (!destinationId) {
      return NextResponse.json(
        { error: 'Ville non trouvée' },
        { status: 404 }
      );
    }

    // Deuxième étape : rechercher les hôtels
    const hotelsResponse = await fetch(
      `https://hotels4.p.rapidapi.com/properties/v2/list?destinationId=${destinationId}&checkInDate=${date}&checkOutDate=${date}&adults=1&children=0&rooms=1&currency=EUR&locale=fr_FR`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
      }
    );

    const hotelsData = await hotelsResponse.json();
    
    // Transformer les données pour correspondre à notre format
    const formattedHotels = await Promise.all(hotelsData.properties.map(async (hotel) => {
      // Récupérer les photos de l'hôtel
      const photosResponse = await fetch(
        `https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=${hotel.id}`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST,
          },
        }
      );
      const photosData = await photosResponse.json();
      const mainPhoto = photosData.hotelImages?.[0]?.baseUrl;

      return {
        id: hotel.id,
        name: hotel.name,
        address: hotel.address.streetAddress,
        price: hotel.price.lead.amount,
        rating: hotel.starRating,
        amenities: hotel.amenities || [],
        image: mainPhoto || null,
        description: hotel.description?.text || 'Aucune description disponible',
      };
    }));

    return NextResponse.json(formattedHotels);
  } catch (error) {
    console.error('Erreur lors de la recherche d\'hébergements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche d\'hébergements' },
      { status: 500 }
    );
  }
} 
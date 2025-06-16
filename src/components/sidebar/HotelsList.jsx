import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building } from 'lucide-react';

const HotelsList = ({ hotels, onHotelClick }) => {
  if (!hotels || hotels.length === 0) {
    return (
      <Card className="w-80 bg-white/90 backdrop-blur-sm shadow-lg">
        <CardContent className="p-4">
          <p className="text-gray-500 text-center">Aucun hôtel trouvé à proximité</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 bg-white/90 backdrop-blur-sm shadow-lg max-h-[80vh] overflow-y-auto">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Hôtels à proximité</h3>
        <div className="space-y-4">
          {hotels.map((hotel, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h4 className="font-medium">{hotel.name}</h4>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={14} />
                {hotel.address}
              </p>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                <Building size={14} />
                <span>{hotel.category} - {hotel.type}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHotelClick(hotel)}
                >
                  Voir sur la carte
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelsList; 
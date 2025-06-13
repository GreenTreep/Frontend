import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const emissions = {
    voiture: 0.2,
    train: 0.04,
    avion: 0.25,
    velo: 0.0,
};

function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function CarbonCalculator() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [transport, setTransport] = useState("voiture");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [animatedCO2, setAnimatedCO2] = useState(0);
    const [startSuggestions, setStartSuggestions] = useState([]);
    const [endSuggestions, setEndSuggestions] = useState([]);
    const navigate = useNavigate();

    const mapboxToken = "pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ";

    useEffect(() => {
        if (result?.co2) {
            let start = 0;
            const target = parseFloat(result.co2);
            const step = target / 50;
            const interval = setInterval(() => {
                start += step;
                if (start >= target) {
                    start = target;
                    clearInterval(interval);
                }
                setAnimatedCO2(start.toFixed(2));
            }, 10);
            return () => clearInterval(interval);
        }
    }, [result]);

    const fetchSuggestions = async (query, setSuggestions) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&autocomplete=true&access_token=${mapboxToken}`);
            const data = await res.json();
            setSuggestions(data.features.map((f) => ({ name: f.place_name, coords: f.center })));
        } catch (err) {
            console.error("Erreur suggestions Mapbox:", err);
        }
    };

    const getCoordinates = async (city) => {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
        const data = await res.json();
        if (data.length === 0) throw new Error("Ville non trouvée");
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    };

    const calculate = async () => {
        try {
            setLoading(true);
            const startCoords = await getCoordinates(start);
            const endCoords = await getCoordinates(end);
            const distance = haversineDistance(startCoords.lat, startCoords.lon, endCoords.lat, endCoords.lon);
            const co2 = (distance * emissions[transport]).toFixed(2);
            setResult({ distance: distance.toFixed(1), co2 });
            setLoading(false);
        } catch (e) {
            alert("Erreur : " + e.message);
            setLoading(false);
        }
    };

    const getImpactMessage = () => {
        if (!result) return null;
        const co2 = parseFloat(result.co2);
        if (co2 < 2) {
            return { text: "🌱 Excellent choix ! Ton empreinte est très faible.", color: "text-green-600" };
        } else if (co2 < 10) {
            return { text: "🧐 Moyenne acceptable, mais on peut faire mieux.", color: "text-yellow-600" };
        } else {
            return { text: "⚠️ Forte émission. Essaie un transport plus durable.", color: "text-red-600" };
        }
    };

    const impact = getImpactMessage();

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-green-600 text-4xl font-extrabold">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                    Empreinte Carbone
                </div>
                <p className="text-muted-foreground mt-2">Estime ton émission de CO₂ selon ton transport et ton trajet.</p>
            </div>

            <Card className="p-6 rounded-2xl shadow-xl bg-white space-y-4">
                <div className="relative">
                    <Input placeholder="Ville de départ" value={start} onChange={(e) => {
                        setStart(e.target.value);
                        fetchSuggestions(e.target.value, setStartSuggestions);
                    }} />
                    {startSuggestions.length > 0 && (
                        <ul className="absolute bg-white border rounded-md mt-1 w-full z-10">
                            {startSuggestions.map((s, i) => (
                                <li key={i} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => {
                                    setStart(s.name);
                                    setStartSuggestions([]);
                                }}>{s.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="relative">
                    <Input placeholder="Ville d'arrivée" value={end} onChange={(e) => {
                        setEnd(e.target.value);
                        fetchSuggestions(e.target.value, setEndSuggestions);
                    }} />
                    {endSuggestions.length > 0 && (
                        <ul className="absolute bg-white border rounded-md mt-1 w-full z-10">
                            {endSuggestions.map((s, i) => (
                                <li key={i} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => {
                                    setEnd(s.name);
                                    setEndSuggestions([]);
                                }}>{s.name}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <Select value={transport} onValueChange={setTransport}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir un moyen de transport" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="voiture">🚗 Voiture</SelectItem>
                        <SelectItem value="train">🚄 Train</SelectItem>
                        <SelectItem value="avion">✈️ Avion</SelectItem>
                        <SelectItem value="velo">🚴 Vélo</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={calculate} disabled={loading} className="w-full">
                    {loading ? "Calcul en cours..." : "Calculer"}
                </Button>
            </Card>

            {result && (
                <>
                    <Card className="mt-8 p-6 bg-gradient-to-br from-green-100 via-white to-green-50 rounded-xl text-center shadow-md">
                        <h2 className="text-2xl font-bold mb-2">🌿 Résultats</h2>
                        <p className="text-lg">📏 Distance estimée : <strong>{result.distance} km</strong></p>
                        <p className="text-lg">🌫️ Émission estimée : <strong>{animatedCO2} kg CO₂</strong></p>
                        {impact && <p className={`mt-4 font-medium ${impact.color}`}>{impact.text}</p>}
                    </Card>

                    <div className="text-center mt-6">
                        <p className="text-muted-foreground mb-2">📚 Découvre comment réduire ton empreinte carbone</p>
                        <Button onClick={() => navigate("/eco-news")}>Lire les actus écologiques</Button>
                    </div>
                </>
            )}

            <p className="text-xs text-muted-foreground text-center mt-6">
                Basé sur des moyennes d’émission par km par transport — Source : ADEME
            </p>
        </div>
    );
}

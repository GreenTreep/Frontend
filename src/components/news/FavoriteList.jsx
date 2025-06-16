import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/security/auth/Api";
import { useEffect, useState } from "react";

function FavoritesList() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/favorites")
            .then((res) => {
                setFavorites(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("[FavoritesList] Erreur lors du fetch:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold mb-6">⭐ Mes articles favoris</h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <p className="text-muted-foreground">Aucun favori pour le moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((fav, index) => (
                        <Card key={index} className="rounded-2xl shadow p-4">
                            {fav.image_url && (
                                <img
                                    src={fav.image_url}
                                    alt=""
                                    className="w-full h-48 object-cover rounded-xl mb-4"
                                />
                            )}
                            <CardContent>
                                <h3 className="text-xl font-bold mb-2">{fav.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {fav.description?.slice(0, 200)}...
                                </p>
                                <Button variant="link" onClick={() => window.open(fav.link, '_blank')}>
                                    Lire l'article
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoritesList;

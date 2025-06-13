import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/security/auth/Api";
import { useAuth } from '@/security/auth/AuthContext';
import { useEffect, useState } from "react";

const topics = [
    { label: "🌿 Écologie", value: "écologie" },
    { label: "🚴 Voyages durables", value: "voyage durable" },
    { label: "🌍 Climat", value: "climat" },
    { label: "🏕️ Tourisme vert", value: "tourisme vert" },
    { label: "🔋 Énergies renouvelables", value: "énergies renouvelables" },
    { label: "🛤️ Mobilité douce", value: "mobilité douce" },
];

function ArticleCard({ article, onFavorite, onView, isAuthenticated, openDialog }) {
    return (
        <Card className="rounded-2xl shadow p-4">
            {article.image_url && (
                <img
                    src={article.image_url}
                    alt=""
                    className="w-full h-48 object-cover rounded-xl mb-4"
                />
            )}
            <CardContent>
                <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                <p className="text-xs text-muted-foreground mb-1">
                    {new Date(article.pubDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                    {article.description?.slice(0, 200)}...
                </p>
                <div className="flex justify-between items-center">
                    <Button variant="link" onClick={() => (isAuthenticated ? onView(article) : openDialog())}>
                        Lire l'article
                    </Button>
                    <Button variant="ghost" onClick={() => (isAuthenticated ? onFavorite(article) : openDialog())}>
                        ⭐ Favori
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function EcoNews() {
    const [articles, setArticles] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("écologie");
    const [dialogOpen, setDialogOpen] = useState(false);
    const { user } = useAuth();
    const isAuthenticated = !!user;

    useEffect(() => {
        setLoading(true);
        fetch(
            `https://newsdata.io/api/1/news?apikey=pub_b409c31e41304c848838bb4047b7c6b9&language=fr&q=${search}`
        )
            .then((res) => res.json())
            .then((data) => {
                setArticles(data.results || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [search]);

    useEffect(() => {
        if (!isAuthenticated) return;
        api.get("/favorites")
            .then((res) => setFavorites(res.data || []))
            .catch((err) => console.error("[EcoNews] Erreur chargement favoris:", err));
    }, [isAuthenticated]);

    const saveToFavorites = (article) => {
        api.post("/favorites", article)
            .then(() => {
                setFavorites((prev) => [...prev, article]);
                console.log("[EcoNews] Article ajouté aux favoris.");
            })
            .catch((err) => console.error("[EcoNews] Erreur lors de l'ajout aux favoris:", err));
    };

    const trackView = (article) => {
        api.post("/api/news/view", {
            title: article.title,
            url: article.link,
        })
            .then(() => window.open(article.link, '_blank'))
            .catch((err) => console.error("[EcoNews] Erreur tracking:", err));
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold mb-6">📰 Actualités écologiques</h1>

            <div className="mb-6">
                <Select value={search} onValueChange={setSearch}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un sujet écologique..." />
                    </SelectTrigger>
                    <SelectContent>
                        {topics.map((topic) => (
                            <SelectItem key={topic.value} value={topic.value}>
                                {topic.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Vous n'êtes pas connecté</DialogTitle>
                        <DialogDescription>
                            Connectez-vous maintenant pour ajouter des articles en favoris ou les consulter.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4">
                        <Button onClick={() => window.location.href = "/login"}>
                            Se connecter
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article, index) => (
                        <ArticleCard
                            key={index}
                            article={article}
                            onFavorite={saveToFavorites}
                            onView={trackView}
                            isAuthenticated={isAuthenticated}
                            openDialog={() => setDialogOpen(true)}
                        />
                    ))}
                </div>
            )}

            {isAuthenticated && (
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">⭐ Mes favoris</h2>
                    {favorites.length === 0 ? (
                        <p className="text-muted-foreground">Aucun favori pour le moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {favorites.map((fav, index) => (
                                <ArticleCard
                                    key={`fav-${index}`}
                                    article={fav}
                                    onFavorite={() => { }}
                                    onView={trackView}
                                    isAuthenticated={isAuthenticated}
                                    openDialog={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default EcoNews;

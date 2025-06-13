import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/security/auth/Api";
import { useAuth } from "@/security/auth/AuthContext";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const topics = [
    { label: "🌿 Écologie", value: "écologie" },
    { label: "🚴 Voyages durables", value: "voyage durable" },
    { label: "🌍 Climat", value: "climat" },
    { label: "🏕️ Tourisme vert", value: "tourisme vert" },
    { label: "🔋 Énergies renouvelables", value: "énergies renouvelables" },
    { label: "🛤️ Mobilité douce", value: "mobilité douce" },
];

function ArticleCard({
    article,
    isFavorite,
    onFavorite,
    onView,
    isAuthenticated,
    openDialog
}) {
    return (
        <Card className="break-inside-avoid mb-6 rounded-2xl shadow p-4">
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
                    {article.description?.slice(0, 200)}…
                </p>
                <div className="flex justify-between items-center">
                    <Button
                        variant="link"
                        onClick={() =>
                            isAuthenticated ? onView(article) : openDialog()
                        }
                    >
                        Lire l'article
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            isAuthenticated ? onFavorite(article) : openDialog()
                        }
                    >
                        {isFavorite ? "⭐ Retirer" : "☆ Ajouter"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function EcoNews() {
    const { user } = useAuth();
    const isAuthenticated = !!user;

    const [articles, setArticles] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [stats, setStats] = useState(null);
    const [topViews, setTopViews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        api
            .get("/favorites")
            .then((res) => setFavorites(res.data || []))
            .catch(console.error);
    }, [isAuthenticated]);

    useEffect(() => {
        if (!search) return;
        setLoading(true);
        api
            .get(`/news/external-news?topic=${encodeURIComponent(search)}`)
            .then((res) => {
                const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
                setArticles(data.results || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("[EcoNews] Erreur de chargement des articles :", err);
                setLoading(false);
            });
    }, [search]);

    useEffect(() => {
        if (!isAuthenticated) return;
        api.get("news/views/stats").then((res) => setStats(res.data));
        api.get("news/views/top").then((res) => setTopViews(res.data));
    }, [isAuthenticated]);

    const downloadCsv = async () => {
        try {
            const res = await api.get("/news/views/export", { responseType: "blob" });
            const blob = new Blob([res.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "views.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Erreur lors du téléchargement CSV:", err);
        }
    };

    const trackView = (article) => {
        api
            .post("news/view", { title: article.title, url: article.link })
            .then(() => {
                window.open(article.link, "_blank");
                api.get("news/views/stats").then((res) => setStats(res.data));
                api.get("news/views/top").then((res) => setTopViews(res.data));
            });
    };

    const toggleFavorite = (article) => {
        const url = article.link || article.url;
        const exists = favorites.some((f) => f.url === url);

        if (exists) {
            api
                .delete(`/favorites?url=${encodeURIComponent(url)}`)
                .then(() =>
                    setFavorites((prev) => prev.filter((f) => f.url !== url))
                )
                .catch(console.error);
        } else {
            const payload = {
                title: article.title,
                url: url,
                imageUrl: article.image_url,
            };
            api
                .post("/favorites", payload)
                .then(() =>
                    setFavorites((prev) => [...prev, payload])
                )
                .catch(console.error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold mb-6">📰 Actualités écologiques</h1>

            <div className="flex space-x-6">
                <div className="flex-1 space-y-6">
                    <Select value={search} onValueChange={setSearch}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="-- Sélectionnez un sujet --" />
                        </SelectTrigger>
                        <SelectContent>
                            {topics.map((topic) => (
                                <SelectItem key={topic.value} value={topic.value}>
                                    {topic.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isAuthenticated && (
                        <Card className="rounded-2xl shadow p-4">
                            <Collapsible>
                                <CollapsibleTrigger className="text-xl font-semibold">
                                    ⭐ Mes favoris ({favorites.length})
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4 columns-1 md:columns-2 gap-4 space-y-6">
                                    {favorites.length === 0 ? (
                                        <p className="text-muted-foreground">
                                            Aucun favori pour le moment.
                                        </p>
                                    ) : (
                                        favorites.map((fav, idx) => (
                                            <ArticleCard
                                                key={idx}
                                                article={fav}
                                                isFavorite={true}
                                                onFavorite={toggleFavorite}
                                                onView={trackView}
                                                isAuthenticated={isAuthenticated}
                                                openDialog={() => setDialogOpen(true)}
                                            />
                                        ))
                                    )}
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    )}

                    {loading ? (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="break-inside-avoid mb-6 h-64 w-full rounded-2xl"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {articles.map((article, idx) => (
                                <ArticleCard
                                    key={idx}
                                    article={article}
                                    isFavorite={favorites.some((f) => f.url === article.link)}
                                    onFavorite={toggleFavorite}
                                    onView={trackView}
                                    isAuthenticated={isAuthenticated}
                                    openDialog={() => setDialogOpen(true)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {isAuthenticated && stats && (
                    <div className="w-1/3 space-y-6">
                        <Link to="/carbon-footprint">
                            <Button className="w-full">
                                🌱 Calculer votre empreinte carbone pour votre voyage
                            </Button>
                        </Link>

                        <Card className="rounded-2xl shadow p-4">
                            <CardContent>
                                <h2 className="text-2xl font-semibold mb-4">📊 Statistiques</h2>
                                <p className="mb-2">
                                    Total vues : <strong>{stats.totalViews}</strong>
                                </p>
                                <p className="mb-4">
                                    Dernier article consulté :{" "}
                                    <strong>{stats.lastViewedTitle || "Aucun"}</strong>
                                </p>
                                <Button onClick={downloadCsv}>
                                    📥 Télécharger l'historique
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl shadow p-4">
                            <CardContent>
                                <h2 className="text-2xl font-semibold mb-4">
                                    🔥 Top articles
                                </h2>
                                {topViews.length === 0 ? (
                                    <p className="text-muted-foreground">
                                        Aucun article consulté pour l'instant.
                                    </p>
                                ) : (
                                    <ul className="list-disc list-inside space-y-2">
                                        {topViews.map((a, i) => (
                                            <li key={i}>
                                                <a
                                                    href={a.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline"
                                                >
                                                    {a.url}
                                                </a>{" "}
                                                ({a.views} vues)
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Vous n'êtes pas connecté</DialogTitle>
                        <DialogDescription>
                            Connectez-vous pour ajouter ou retirer des favoris.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4">
                        <Button onClick={() => (window.location.href = "/login")}>Se connecter</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
EcoNews.displayName = "EcoNews";

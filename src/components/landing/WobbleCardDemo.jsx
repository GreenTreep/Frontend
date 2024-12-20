"use client";
import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import ImageGrid from "@/components/ui/ImageGrid"; 

export function WobbleCardDemo() {
    const partagezAventuresImages = [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=3387&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3540&auto=format&fit=crop",
        "https://www.science-et-vie.com/wp-content/uploads/scienceetvie/2021/07/comment-prevoir-meteo-scaled.jpg",
        "https://www.lademeureduparc.fr/wp-content/uploads/2024/05/Les-meilleurs-road-trips-en-Europe-pour-un-ete-inoubliable.png",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=3425&auto=format&fit=crop",
        "https://images.squarespace-cdn.com/content/v1/5eabefd1b259fc1e715e7e3b/aea49c69-b6b0-463b-b41a-c43f261768de/OS+X+MR+Edited-16.jpg"
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full p-6">
            {/* Premier WobbleCard */}
            <WobbleCard
                containerClassName="col-span-1 lg:col-span-2 h-full bg-green-600 min-h-[500px] lg:min-h-[300px] relative"
                className=""
            >
                <div className="max-w-xs">
                    <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-white">
                        GreenTrip Connecte les Aventuriers
                    </h2>
                    <p className="mt-4 text-left text-base text-neutral-200">
                        Rejoignez une communauté mondiale de randonneurs, partagez vos itinéraires préférés et découvrez de nouveaux sentiers à explorer.
                    </p>
                </div>
                <img
                    src="https://www.novo-monde.com/app/uploads/2023/03/Real-time-information-1024x805.png"
                    alt="Capture d'écran de l'application GreenTrip"
                    className="absolute  grayscale filter bottom-5 right-5 object-contain rounded-2xl 
                               w-40 md:w-56 lg:w-64"
                />
            </WobbleCard>

            {/* Deuxième WobbleCard */}
            <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-green-700 relative">
                <h2 className="max-w-80 text-left text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-white">
                    Itinéraires Personnalisés
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base text-neutral-200">
                    Créez et sauvegardez vos propres itinéraires de randonnée ou explorez ceux créés par d'autres utilisateurs.
                </p>
                <img
                    src="https://www.alltrails.com/_next/image?url=https%3A%2F%2Fwww.alltrails.com%2Fapi%2Falltrails%2Fv3%2Fmaps%2F287751117%2Fstatic_map%3Fkey%3D3p0t5s6b5g4g0e8k3c1j3w7y5c3m4t8i%26size%3D295x240%26scale%3D2&w=3840&q=75"
                    alt="Capture d'écran de l'application GreenTrip"
                    className="absolute -right-10 md:-right-[40%] lg:-right-[10%] -z-10 -bottom-10 blur-sm object-contain rounded-2xl 
                               w-32 md:w-40 lg:w-48"
                />
            </WobbleCard>

            {/* Troisième WobbleCard - Partagez Vos Aventures */}
            <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-green-800 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] relative">
                <div className="max-w-sm">
                    <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-white">
                        Partagez Vos Aventures
                    </h2>
                    <p className="mt-4 text-left text-base text-neutral-200">
                        Publiez vos photos, itinéraires et expériences de randonnée pour inspirer d'autres aventuriers.
                    </p>
                </div>
                {/* Intégration du composant ImageGrid avec des images personnalisées */}
                <ImageGrid images={partagezAventuresImages} />
            </WobbleCard>
        </div>
    );
}

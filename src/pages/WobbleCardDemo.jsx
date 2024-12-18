// WobbleCardDemo.jsx

"use client";
import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";

export function WobbleCardDemo() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full p-6">
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
                    src="https://png.pngtree.com/png-clipart/20230513/ourmid/pngtree-black-mobile-phone-png-image_7097040.png"
                    alt="Capture d'écran de l'application GreenTrip"
                    className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
                />
            </WobbleCard>
            <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-green-700 relative">
                <h2 className="max-w-80 text-left text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-white">
                    Itinéraires Personnalisés
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base text-neutral-200">
                    Créez et sauvegardez vos propres itinéraires de randonnée ou explorez ceux créés par d'autres utilisateurs.
                </p>
                <img
                    src="https://png.pngtree.com/png-clipart/20230513/ourmid/pngtree-black-mobile-phone-png-image_7097040.png"
                    alt="Capture d'écran de l'application GreenTrip"
                    className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
                />
            </WobbleCard>
            <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-green-800 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] relative">
                <div className="max-w-sm">
                    <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-tight text-white">
                        Partagez Vos Aventures
                    </h2>
                    <p className="mt-4 text-left text-base text-neutral-200">
                        Publiez vos photos, itinéraires et expériences de randonnée pour inspirer d'autres aventuriers.
                    </p>
                </div>
                <img
                    src="https://png.pngtree.com/png-clipart/20230513/ourmid/pngtree-black-mobile-phone-png-image_7097040.png"
                    alt="Capture d'écran de l'application GreenTrip"
                    className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
                />
            </WobbleCard>
        </div>
    );
}

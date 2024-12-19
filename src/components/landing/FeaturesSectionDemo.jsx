import { cn } from "@/lib/utils";
import {
    IconAdjustmentsBolt,
    IconCloud,
    IconCurrencyDollar,
    IconEaseInOut,
    IconHeart,
    IconHelp,
    IconRouteAltLeft,
    IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
    const features = [
        {
            title: "Conçu pour les randonneurs",
            description:
                "Pensé pour les passionnés de randonnée, les aventuriers et les explorateurs.",
            icon: <IconTerminal2 />,
        },
        {
            title: "Facilité d'utilisation",
            description:
                "Aussi simple à utiliser qu'une application mobile, et aussi fiable qu'un guide local.",
            icon: <IconEaseInOut />,
        },
        {
            title: "Tarification avantageuse",
            description:
                "Nos prix sont les meilleurs du marché. Aucun engagement, aucun abonnement, sans carte de crédit requise.",
            icon: <IconCurrencyDollar />,
        },
        {
            title: "Garantie de disponibilité 100%",
            description: "Notre service est toujours disponible, où que vous soyez.",
            icon: <IconCloud />,
        },
        {
            title: "Architecture multi-utilisateurs",
            description: "Partagez facilement vos itinéraires et collaborez avec d'autres randonneurs.",
            icon: <IconRouteAltLeft />,
        },
        {
            title: "Support Client 24/7",
            description:
                "Nous sommes disponibles à tout moment pour répondre à vos questions et vous aider.",
            icon: <IconHelp />,
        },
        {
            title: "Garantie de remboursement",
            description:
                "Si vous n'êtes pas satisfait de GreenTrip, nous vous remboursons sans condition.",
            icon: <IconAdjustmentsBolt />,
        },
        {
            title: "Et bien plus encore",
            description: "Nous continuons d'ajouter de nouvelles fonctionnalités pour améliorer votre expérience.",
            icon: <IconHeart />,
        },
    ];
    return (
        (<div
            className="grid grid-cols-1 bg-white dark:bg-black md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>)
    );
}

const Feature = ({
    title,
    description,
    icon,
    index
}) => {
    return (
        (<div
            className={cn(
                "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}>
            {index < 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div
                className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div
                    className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-green-500 transition-all duration-200 origin-center" />
                <span
                    className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p
                className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>)
    );
};
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function UpgradeButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/stripe/checkout", { method: "POST" });
            if (!res.ok) throw new Error("Failed to create checkout session");
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error("Upgrade failed:", error);
            setIsLoading(false);
            // Ideally show a toast here
        }
    };

    return (
        <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </>
            ) : (
                "Upgrade to Pro"
            )}
        </button>
    );
}

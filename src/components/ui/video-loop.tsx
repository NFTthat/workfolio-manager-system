"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface VideoLoopProps {
    src: string
    poster?: string
    className?: string
    overlayOpacity?: number
}

export function VideoLoop({
    src,
    poster,
    className,
    overlayOpacity = 0.2
}: VideoLoopProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const isVideo = src.endsWith('.mp4') || src.endsWith('.webm')

    return (
        <div className={cn("relative overflow-hidden w-full h-full bg-slate-950", className)}>
            {/* Media Layer */}
            {!hasError ? (
                isVideo ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        poster={poster}
                        onError={() => setHasError(true)}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                ) : (
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {/* Ken Burns Effect Image */}
                        <img
                            src={src}
                            alt="Background"
                            className="w-full h-full object-cover animate-ken-burns scale-110"
                            onError={() => setHasError(true)}
                        />
                        <style jsx>{`
                            @keyframes ken-burns {
                                0% { transform: scale(1.0) translate(0, 0); }
                                50% { transform: scale(1.1) translate(-1%, -1%); }
                                100% { transform: scale(1.0) translate(0, 0); }
                            }
                            .animate-ken-burns {
                                animation: ken-burns 20s ease-in-out infinite alternate;
                            }
                        `}</style>
                    </div>
                )
            ) : (
                /* Fallback Animation Layer */
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 animate-pulse" />
            )}

            {/* Overlay to ensure text readability */}
            <div
                className="absolute inset-0 bg-background/50 backdrop-blur-[2px]"
                style={{ opacity: overlayOpacity }}
            />

            {/* Gradient Overlay for smooth edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
        </div>
    )
}

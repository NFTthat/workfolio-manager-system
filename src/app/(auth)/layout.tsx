import { Metadata } from "next"
import Link from "next/link"
import { Command } from "lucide-react"
import { VideoLoop } from "@/components/ui/video-loop"
import { AnimatedTestimonials } from "@/components/auth/animated-testimonials"

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <VideoLoop
                        src="/auth-anime.png"
                        className="scale-105" // Slight scale to avoid edges
                        overlayOpacity={0.3}
                    />
                </div>
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Command className="mr-2 h-6 w-6" />
                    Portfolio Manager
                </div>

                <AnimatedTestimonials />
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {children}
                </div>
            </div>
        </div>
    )
}

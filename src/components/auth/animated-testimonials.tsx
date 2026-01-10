"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const testimonials = [
    {
        quote: "This portfolio manager has saved me countless hours of work and helped me deliver stunning results.",
        author: "Sofia Davis",
        role: "Senior Developer"
    },
    {
        quote: "The AI features are a game changer. It rewrote my bio perfectly and categorized my messy experience history.",
        author: "Alex Chen",
        role: "UX Engineer"
    },
    {
        quote: "I landed my dream job within a week of deploying my new portfolio. The design is simply top-tier.",
        author: "Marcus Johnson",
        role: "Frontend Architect"
    }
]

export function AnimatedTestimonials() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative z-20 mt-auto min-h-[140px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <blockquote className="space-y-2">
                        <p className="text-lg leading-relaxed">
                            &ldquo;{testimonials[current].quote}&rdquo;
                        </p>
                        <footer className="text-sm pt-2">
                            <div className="font-semibold">{testimonials[current].author}</div>
                            <div className="text-muted-foreground text-xs">{testimonials[current].role}</div>
                        </footer>
                    </blockquote>
                </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="flex gap-2 mt-6">
                {testimonials.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-500 ${idx === current ? "w-8 bg-white" : "w-2 bg-white/30"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

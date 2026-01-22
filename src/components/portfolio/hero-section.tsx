"use client"

import { motion } from "framer-motion"
import { Meta } from "@/lib/types/portfolio"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Twitter, MapPin } from "lucide-react"
import Image from "next/image"

interface HeroSectionProps {
  meta: Meta
}

export function HeroSection({ meta }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4">
              👋 Welcome to my portfolio
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Hi, I&apos;m{" "}
              <span className="text-primary">
                {meta.name}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mt-4">
              {meta.title}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="gap-2">
              <a href={`mailto:${meta.email}`}>
                <Mail className="w-4 h-4" />
                Get in touch
              </a>
            </Button>
            {meta.twitter && (
              <Button variant="outline" size="lg" asChild className="gap-2">
                <a href={meta.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" />
                  Follow me
                </a>
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <MapPin className="w-4 h-4" />
            <span>{meta.location}</span>
          </motion.div>
        </motion.div>

        {/* Right side - Hero image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              {meta.heroImage ? (
                <div className="relative w-64 h-64 mx-auto">
                  <Image
                    src={meta.heroImage}
                    alt={meta.name}
                    fill
                    className="object-cover rounded-full"
                    priority
                    sizes="256px"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                  <div className="text-6xl">
                    {meta.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
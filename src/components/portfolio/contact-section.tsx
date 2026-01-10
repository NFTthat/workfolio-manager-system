"use client"

import { motion } from "framer-motion"
import { Contact, Meta } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, Send } from "lucide-react"

interface ContactSectionProps {
  contact: Contact
  meta: Meta
}

export function ContactSection({ contact, meta }: ContactSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Let's Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {contact.note}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{meta.email}</span>
                  </div>
                  {meta.location && (
                    <div className="text-sm text-muted-foreground">
                      📍 {meta.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Reach Out</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full gap-2">
                  <a href={`mailto:${meta.email}`}>
                    <Mail className="w-4 h-4" />
                    Send me an email
                  </a>
                </Button>

                {meta.twitter && (
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a
                      href={meta.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Follow on Twitter
                    </a>
                  </Button>
                )}

                <Button variant="secondary" className="w-full gap-2" asChild>
                  <a href="#hero">
                    <Send className="w-4 h-4" />
                    Back to top
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick response time indicator */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-sm text-muted-foreground">
                    I typically respond within 24-48 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"

interface UpgradeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500" />
                        Upgrade to Pro
                    </DialogTitle>
                    <DialogDescription>
                        Unlock the full potential of your portfolio manager.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-green-100 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm">Unlimited Projects & Experiences</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-green-100 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm">Custom Experience Sections</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-green-100 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm">Delete Content (Items & Sections)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-green-100 rounded-full">
                                <Check className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm">Priority Support</span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4 mt-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Early Adopter Offer</span>
                            <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700 font-medium">50% OFF</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Be one of the first 100 users to upgrade and lock in this price forever.
                        </p>
                        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0">
                            Upgrade - $9/mo
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

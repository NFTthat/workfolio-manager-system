"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    LayoutDashboard,
    LogOut,
    Loader2,
    Edit,
    Eye,
    Plus,
    Diamond,
    Sparkles
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ContentEditor } from "@/components/admin/content-editor"
import { SettingsTab } from "@/components/admin/settings-tab"
import { UsersTab } from "@/components/admin/users-tab"
import { PortfolioContent } from "@/lib/types/portfolio"

interface AdminDashboardProps {
    user: any
    initialData: PortfolioContent | null
}

export default function AdminDashboard({ user, initialData }: AdminDashboardProps) {
    const router = useRouter()
    const [portfolioData, setPortfolioData] = useState<PortfolioContent | null>(initialData)
    const [isLoading, setIsLoading] = useState(!initialData)
    const [activeTab, setActiveTab] = useState("dashboard")
    const [editorTab, setEditorTab] = useState<string>("meta")
    const supabase = createClient()
    // STRICT CHECK: Only trust the prop passed from the server (which queries the DB)
    // Do NOT check user_metadata as it may be stale
    const isPro = user.isPro;

    useEffect(() => {
        if (initialData) {
            setIsLoading(false)
            return
        }

        const fetchPortfolioData = async () => {
            try {
                const response = await fetch("/api/portfolio/admin")
                if (response.ok) {
                    const { portfolio } = await response.json()
                    setPortfolioData(portfolio)
                }
            } catch (error) {
                console.error("Failed to fetch portfolio data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPortfolioData()
    }, [initialData])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/sign-in")
        router.refresh()
    }

    const handleQuickAction = (tabName: string) => {
        setEditorTab(tabName)
        setActiveTab("content")
    }

    const handleUpgrade = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("/api/stripe/checkout", { method: "POST" })
            if (!res.ok) throw new Error("Failed to create checkout session")
            const data = await res.json()
            window.location.href = data.url
        } catch (error) {
            console.error("Upgrade failed:", error)
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="bg-background border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">🤖 Workfolio</h1>
                            {isPro ? <Badge className="bg-purple-500 hover:bg-purple-600"><Diamond className="w-3 h-3 mr-1 fill-white" /> Pro</Badge> : <Badge variant="secondary">Free</Badge>}
                        </div>
                        <div className="flex items-center space-x-4">
                            {!isPro && (
                                <Button size="sm" onClick={handleUpgrade} className="hidden sm:flex bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
                                    <Diamond className="w-4 h-4 mr-2 fill-white" />
                                    Join Pro - 50% Off
                                </Button>
                            )}
                            <span className="text-sm text-muted-foreground hidden md:inline-block">
                                {user.email}
                            </span>
                            <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-8 w-full justify-start overflow-x-auto">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="content">Workfolio Editor</TabsTrigger>
                        {/* Users tab strictly for admin role check, separate from Pro */}
                        {(user.user_metadata?.role === 'admin' || user.email?.includes('admin')) && (
                            <TabsTrigger value="users">Users</TabsTrigger>
                        )}
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard">
                        {portfolioData ? (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-1">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <LayoutDashboard className="w-5 h-5" />
                                                Quick Stats
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Experiences</span>
                                                <Badge variant="secondary">{portfolioData?.experiences?.length || 0}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Projects</span>
                                                <Badge variant="secondary">{portfolioData?.projects?.length || 0}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Skills</span>
                                                <Badge variant="secondary">{portfolioData?.skills?.length || 0}</Badge>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Last Updated</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date().toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {!isPro && (
                                        <Card className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-100">
                                            <CardHeader>
                                                <CardTitle className="text-purple-700 flex items-center">
                                                    <Diamond className="w-4 h-4 mr-2" /> Upgrade to Pro
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-2 text-sm text-purple-900 mb-4">
                                                    <li className="flex items-center"><Sparkles className="w-3 h-3 mr-2" /> Unlimited Experiences</li>
                                                    <li className="flex items-center"><Sparkles className="w-3 h-3 mr-2" /> Custom Categories</li>
                                                    <li className="flex items-center"><Sparkles className="w-3 h-3 mr-2" /> AI Assistant</li>
                                                </ul>
                                                <Button onClick={handleUpgrade} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                                    Upgrade Now
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                <div className="lg:col-span-3 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Quick Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <Button
                                                    variant="outline"
                                                    className="gap-2"
                                                    onClick={() => handleQuickAction("meta")}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit Content
                                                </Button>
                                                <Button variant="outline" className="gap-2" onClick={() => window.open("/portfolio", "_blank")}>
                                                    <Eye className="w-4 h-4" />
                                                    View Site
                                                </Button>
                                                <Button variant="outline" className="gap-2" onClick={() => handleQuickAction("experiences")}>
                                                    <Plus className="w-4 h-4" />
                                                    Add Experience
                                                </Button>
                                                <Button variant="outline" className="gap-2" onClick={() => handleQuickAction("projects")}>
                                                    <Plus className="w-4 h-4" />
                                                    Add Project
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Recent Experiences</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {portfolioData?.experiences?.slice(0, 3).map((exp, index) => (
                                                    <div key={index} className="space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-medium">{exp.role}</h4>
                                                                <p className="text-sm text-muted-foreground">{exp.org}</p>
                                                            </div>
                                                            <Button variant="ghost" size="sm" onClick={() => handleQuickAction("experiences")}>
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        {index < ((portfolioData.experiences?.length || 0) - 1) && <Separator />}
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Recent Projects</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {portfolioData?.projects?.slice(0, 3).map((project, index) => (
                                                    <div key={index} className="space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-medium">{project.title}</h4>
                                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                                    {project.description}
                                                                </p>
                                                            </div>
                                                            <Button variant="ghost" size="sm" onClick={() => handleQuickAction("projects")}>
                                                                <Edit className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        {index < ((portfolioData.projects?.length || 0) - 1) && <Separator />}
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Card className="border-dashed">
                                <CardHeader>
                                    <CardTitle>Welcome to your Workfolio</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <p className="text-muted-foreground text-center max-w-md">
                                        You haven't created a workfolio yet. Get started by organizing your experiences, projects, and skills.
                                    </p>
                                    <Button onClick={() => handleQuickAction("meta")}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Workfolio
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="content">
                        <ContentEditor
                            initialContent={portfolioData || undefined}
                            defaultTab={editorTab}
                            key={editorTab + (portfolioData ? "loaded" : "loading")}
                            isPro={isPro}
                        />
                    </TabsContent>

                    <TabsContent value="users">
                        <UsersTab />
                    </TabsContent>

                    <TabsContent value="settings">
                        <SettingsTab user={user} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

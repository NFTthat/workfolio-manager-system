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
    Plus
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ContentEditor } from "@/components/admin/content-editor"
import { SettingsTab } from "@/components/admin/settings-tab"
import { UsersTab } from "@/components/admin/users-tab"
import { PortfolioContent } from "@/lib/types/portfolio"

interface AdminDashboardProps {
    user: any
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
    const router = useRouter()
    const [portfolioData, setPortfolioData] = useState<PortfolioContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("dashboard")
    const [editorTab, setEditorTab] = useState<string>("meta")
    const supabase = createClient()

    useEffect(() => {
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
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/sign-in")
        router.refresh()
    }

    const handleQuickAction = (tabName: string) => {
        setEditorTab(tabName)
        setActiveTab("content")
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
            <header className="bg-background border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <Badge variant="secondary">Admin</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground">
                                Welcome, {user.email}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleSignOut}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-8">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="content">Content Editor</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
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
                                    <CardTitle>Welcome to your Portfolio</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <p className="text-muted-foreground text-center max-w-md">
                                        You haven't created a portfolio yet. Get started by organizing your experiences, projects, and skills.
                                    </p>
                                    <Button onClick={() => handleQuickAction("meta")}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Portfolio
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

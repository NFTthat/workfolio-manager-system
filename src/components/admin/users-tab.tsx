"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, Trash2, Crown, User as UserIcon } from "lucide-react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface User {
    id: string
    email: string
    name: string | null
    role: "admin" | "user"
    plan: "free" | "pro"
    createdAt: string
}

export function UsersTab() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users")
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            } else {
                toast.error("Failed to fetch users")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error loading users")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            })

            if (response.ok) {
                toast.success(`User role updated to ${newRole}`)
                fetchUsers()
            } else {
                throw new Error("Failed to update role")
            }
        } catch (error) {
            toast.error("Failed to update user role")
        }
    }

    const handlePlanChange = async (userId: string, newPlan: "free" | "pro") => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: newPlan })
            })

            if (response.ok) {
                toast.success(`User plan updated to ${newPlan}`)
                fetchUsers()
            } else {
                throw new Error("Failed to update plan")
            }
        } catch (error) {
            toast.error("Failed to update user plan")
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success("User deleted successfully")
                fetchUsers()
            } else {
                throw new Error("Failed to delete user")
            }
        } catch (error) {
            toast.error("Failed to delete user")
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                    Manage user roles, plans, and access permissions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name || "Unnamed User"}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="gap-1">
                                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.plan === 'pro' ? 'default' : 'outline'} className={user.plan === 'pro' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-0 gap-1' : 'gap-1'}>
                                        {user.plan === 'pro' && <Crown className="w-3 h-3 text-yellow-300" />}
                                        {user.plan === 'pro' ? 'Pro' : 'Free'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')} disabled={user.role === 'admin'}>
                                                Make Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')} disabled={user.role === 'user'}>
                                                Make User
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Change Plan</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handlePlanChange(user.id, 'pro')} disabled={user.plan === 'pro'}>
                                                Upgrade to Pro
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handlePlanChange(user.id, 'free')} disabled={user.plan === 'free'}>
                                                Downgrade to Free
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

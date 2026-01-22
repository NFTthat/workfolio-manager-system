"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ClearCookiesPage() {
    const [status, setStatus] = useState("Clearing cookies...")
    const router = useRouter()

    useEffect(() => {
        const clearCookies = () => {
            const cookies = document.cookie.split(";")

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i]
                const eqPos = cookie.indexOf("=")
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/admin"
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + window.location.hostname + ";path=/"
            }

            setStatus("Cookies cleared successfully!")
        }

        clearCookies()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">{status}</h1>
            <p className="mb-8">Your browser session has been reset to fix the 431 error.</p>
            <Button onClick={() => router.push("/sign-in")}>
                Return to Sign In
            </Button>
        </div>
    )
}

"use client"

import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { PortfolioContent } from "@/lib/types/portfolio"

interface UseSocketOptions {
  autoConnect?: boolean
  enablePortfolioUpdates?: boolean
}

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = false, enablePortfolioUpdates = false } = options
  const socketRef = useRef<Socket | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return

    // Initialize socket connection
    socketRef.current = io(process.env.NODE_ENV === "development" ? "http://localhost:3000" : "", {
      autoConnect,
    })

    const socket = socketRef.current

    if (enablePortfolioUpdates) {
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id)
        socket.emit("subscribe-portfolio")
      })

      socket.on("portfolio-changed", (data) => {
        console.log("Portfolio changed:", data)
        // Trigger a custom event that components can listen to
        window.dispatchEvent(new CustomEvent("portfolio-updated", { detail: data }))
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected")
      })
    }

    isInitialized.current = true

    return () => {
      if (socket) {
        socket.disconnect()
        socketRef.current = null
        isInitialized.current = false
      }
    }
  }, [autoConnect, enablePortfolioUpdates])

  const emitPortfolioUpdate = (data: {
    type: string
    section?: string
    content?: PortfolioContent | Partial<PortfolioContent>
  }) => {
    if (socketRef.current) {
      socketRef.current.emit("portfolio-updated", {
        ...data,
        timestamp: new Date().toISOString(),
      })
    }
  }

  const subscribeToPortfolio = () => {
    if (socketRef.current) {
      socketRef.current.emit("subscribe-portfolio")
    }
  }

  const unsubscribeFromPortfolio = () => {
    if (socketRef.current) {
      socketRef.current.emit("unsubscribe-portfolio")
    }
  }

  return {
    socket: socketRef.current,
    emitPortfolioUpdate,
    subscribeToPortfolio,
    unsubscribeFromPortfolio,
  }
}
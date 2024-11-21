'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import MatchesList from "@/components/MatchesList"
import UserNav from "@/components/usernav"
import { useAuthStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNewGame = () => {
    if (isAuthenticated) {
      console.log("Authenticated. Starting new game.")
      router.push("/game")
    } else {
      console.log("Not authenticated. Redirecting to login.")
      router.push("/login")
    }
  }

  useEffect(() => {
    if (isClient) {
      console.log("Authenticated:", isAuthenticated)
      console.log("User:", user)
    }
  }, [isAuthenticated, user, isClient])

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <div className="relative w-screen h-screen grid place-items-center bg-dodger-blue-600 font-gabarito">
      <main className="flex flex-col w-full h-screen">
        <UserNav />
        <section className="w-full h-full flex flex-col justify-center place-items-center text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">
            THE GENIUS TEST
          </h1>
          <h2 className="max-w-80 lg:text-xl lg:max-w-96 text-dodger-blue-100">
            Are you a genius? You sure are! Prove it by playing now.
          </h2>
          <button
            onClick={handleNewGame}
            className="grid place-items-center mt-3 px-6 h-10 bg-white text-dodger-blue-600 rounded-full"
          >
            {isAuthenticated ? "New game" : "Login to Play"}
          </button>
        </section>
        <footer className="absolute bottom-0 w-full px-7">
          <MatchesList />
        </footer>
      </main>
    </div>
  )
}
'use client'

import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function UserNav() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="absolute top-0 right-0 m-4 flex items-center space-x-4">
      <span className="text-white">{user?.username}</span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-white text-dodger-blue-600 rounded-full text-sm"
      >
        Logout
      </button>
    </nav>
  )
}
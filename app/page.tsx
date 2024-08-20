'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'  // Use 'next/navigation' for App Router
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../lib/firebaseConfig'
import AuthButton from '../components/AuthButton'

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/chatbot')
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="absolute w-screen min-h-screen bg-cover bg-center bg-fixed bg-[url('/images/image_no_bg.png')] opacity-40 -z-10"/>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute w-screen min-h-screen bg-cover bg-center bg-fixed bg-[url('/images/image_no_bg.png')] opacity-30 -z-10"/>
      <h1 className="text-4xl font-bold mb-6">Welcome to our Chatbot</h1>
      <p className="mb-6 text-lg">Please sign in to start chatting</p>
      <AuthButton />
    </div>
  )
}

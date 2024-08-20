'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../lib/firebaseConfig'
import ChatBox from '../../components/ChatBox'
import LanguageSelector from '../../components/LanguageSelector'
import FeedbackForm from '../../components/FeedbackForm'
import { LanguageProvider } from '../../components/LanguageContext'
import { signOut } from 'firebase/auth'

export default function ChatbotPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleLogout = () => {
    signOut(auth).then(() => router.push('/'))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="absolute w-screen min-h-screen bg-cover bg-center bg-fixed bg-[url('/images/image_no_bg.png')] opacity-30 -z-10"/>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold text-black">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <LanguageProvider>
      <div className="flex flex-col items-center justify-center min-h-screen m-10">
        <button
          onClick={handleLogout}
          className="absolute top-12 left-14 px-4 py-2 text-white bg-red-500 rounded-lg shadow hover:bg-red-600 focus:outline-none"
        >
          Log Out
        </button>
        <h1 className="text-3xl font-bold mb-4">Chat with our AI</h1>
        <LanguageSelector />
        <ChatBox />
        <FeedbackForm />
      </div>
    </LanguageProvider>
  )
}

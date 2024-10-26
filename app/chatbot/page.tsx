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
import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-16 h-16 text-white animate-spin" />
          <p className="mt-4 text-xl font-semibold text-white">Loading...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <header className="p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Hey there</h1>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LanguageSelector />
              <ChatBox />
              <FeedbackForm />
            </motion.div>
          </div>
        </main>
      </div>
    </LanguageProvider>
  )
}
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../lib/firebaseConfig'
import AuthButton from '../components/AuthButton'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed bg-[url('/images/image_no_bg.png')] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-purple-600/50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg max-w-md w-full"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl font-bold mb-6 text-white"
        >
          Welcome to Chatbot AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8 text-lg sm:text-xl text-white/90"
        >
          Experience the future of conversation. Sign in to start chatting!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-sm mx-auto"
        >
          <AuthButton />
        </motion.div>
      </motion.div>
    </div>
  )
}
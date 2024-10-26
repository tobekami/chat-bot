'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, signInWithGoogle, signOutUser } from '../lib/firebaseConfig'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'

export default function AuthButton() {
  const [user, loading, error] = useAuthState(auth)

  if (loading) {
    return (
      <Button disabled className="w-full max-w-sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    )
  }

  if (error) {
    return (
      <Button variant="destructive" className="w-full max-w-sm">
        Error: {error.message}
      </Button>
    )
  }

  if (user) {
    return (
      <Button
        onClick={signOutUser}
        variant="destructive"
        className="w-full max-w-sm"
      >
        Sign out
      </Button>
    )
  }

  return (
    <Button
      onClick={signInWithGoogle}
      variant="secondary"
      className="w-full max-w-sm bg-white text-gray-800 hover:bg-gray-100"
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Sign in with Google
    </Button>
  )
}
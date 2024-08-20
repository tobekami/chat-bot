'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, signInWithGoogle, signOutUser } from '../lib/firebaseConfig'
import { FcGoogle } from 'react-icons/fc'

export default function AuthButton() {
  const [user, loading, error] = useAuthState(auth)

  if (loading) return <button className="btn bg-gray-200 text-gray-600">Loading...</button>
  if (error) return <button className="btn bg-red-200 text-red-600">Error: {error.message}</button>

  return user ? (
    <button
      onClick={signOutUser}
      className="flex items-center justify-center p-3 mt-4 text-white bg-red-500 rounded-lg shadow hover:bg-red-600 focus:outline-none"
    >
      Sign out
    </button>
  ) : (
    <button
      onClick={signInWithGoogle}
      className="flex items-center justify-center p-3 mt-4 text-gray-700 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 focus:outline-none"
    >
      <FcGoogle className="mr-2 text-2xl" /> Sign in with Google
    </button>
  )
}

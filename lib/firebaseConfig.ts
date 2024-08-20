// lib/firebaseConfig.js

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase app only if it hasn't been initialized yet
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.error("Error signing in with Google", error)
  }
}

const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out", error)
  }
}

export { auth, signInWithGoogle, signOutUser, app }
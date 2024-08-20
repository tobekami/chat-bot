// app/layout.tsx

import './globals.css'
import { Inter } from "next/font/google"
import { ReactNode } from 'react'

export const metadata = {
  title: 'Chatbot',
  description: 'AI-powered chatbot with multi-model orchestration',
}

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
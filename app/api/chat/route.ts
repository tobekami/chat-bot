// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server'
import processInput from './processInput'

export async function POST(request: NextRequest) {
  try {
    const { input, language } = await request.json()
    const response = await processInput(input, language)
    return NextResponse.json({ response }, { status: 200 })
  } catch (error) {
    console.error('Error processing input:', error)
    return NextResponse.json({ error: 'Error processing input' }, { status: 500 })
  }
}

export function OPTIONS() {
  return NextResponse.json({ allow: ['POST'] }, { status: 200 })
}

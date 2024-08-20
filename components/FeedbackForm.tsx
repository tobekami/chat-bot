"use client"

import { useState } from 'react'

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(feedback) // Placeholder for handling feedback submission
    setFeedback('')
    setIsModalOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
      >
        Send Feedback
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
            <h2 className="mb-2 text-lg font-bold">How was your experience?</h2>
            <textarea
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your feedback here..."
              rows={4}
            />
            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg shadow hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

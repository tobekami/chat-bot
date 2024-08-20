import { useState } from 'react'
import { Message } from '../lib/firestore'
import { FaUser, FaRobot, FaEllipsisV } from 'react-icons/fa'

interface ChatMessageProps {
  message: Message
  onDelete: (id: string) => void
  onClearChat: () => void
}

export default function ChatMessage({ message, onDelete, onClearChat }: ChatMessageProps) {
  const [showMenu, setShowMenu] = useState(false)
  const isUser = message.sender === 'user'

  const handleDelete = () => {
    onDelete(message.id)
    setShowMenu(false)
  }

  return (
    <div
      className={`flex w-{70vw} ${isUser ? 'justify-end' : 'justify-start'} relative group`}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className={`p-3 my-2 mx-2 rounded-lg max-w-xs shadow ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} flex-row items-center static`}>
        <div className={`absolute top-6 ${isUser ? 'right-4' : 'left-4'}`}>{isUser ? <FaUser /> : <FaRobot />}</div>
        <div className={`w-[100%] ${isUser ? 'pr-[18px]' : 'pl-[18px]'}`}><span>{message.text}</span></div>
      </div>
      {showMenu && (
        <div className={`absolute  ${isUser ? 'top-0 left-0 mt-1 ml-1' : 'top-0 right-0 mt-1 mr-1'}`}>
          <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-gray-600">
            <FaEllipsisV />
          </button>
          {showMenu && (
            <div className={`absolute w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ${isUser ? 'left-0 mt-2' : 'right-0 mt-2'}`}>
              <button onClick={handleDelete} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Delete Chat
              </button>
              <button onClick={onClearChat} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Clear Chat
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

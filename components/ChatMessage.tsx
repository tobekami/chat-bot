import { Message } from '../lib/firestore'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Bot, MoreVertical, Trash2, XCircle } from 'lucide-react'

interface ChatMessageProps {
  message: Message
  onDelete: (id: string) => void
  onClearChat: () => void
}

export default function ChatMessage({ message, onDelete, onClearChat }: ChatMessageProps) {
  const isUser = message.sender === 'user'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`relative max-w-[70%] p-3 rounded-lg shadow-md ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}>
        <div className={`absolute top-3 ${isUser ? '-left-8' : '-right-8'}`}>
          {isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </div>
        <div className="flex items-start">
          <p className="flex-grow mr-2">{message.text}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 -mt-1">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(message.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Message</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClearChat}>
                <XCircle className="mr-2 h-4 w-4" />
                <span>Clear Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
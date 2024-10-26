"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebaseConfig";
import { saveMessage, getMessages, Message, clearMessages, deleteMessage } from "../lib/firestore";
import ChatMessage from "./ChatMessage";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2 } from "lucide-react";

export default function ChatBox() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { language } = useLanguage();

  const loadMessages = useCallback(async () => {
    if (user) {
      const loadedMessages = await getMessages(user.uid);
      setMessages(loadedMessages);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, loadMessages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const newMessage: Omit<Message, "id" | "timestamp"> = { text: input, sender: "user", language };
    await saveMessage(user.uid, newMessage, language);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, language }),
    });
    const data = await response.json();

    const botMessage: Omit<Message, "id" | "timestamp"> = { text: data.response, sender: "bot", language };
    await saveMessage(user.uid, botMessage, language);

    loadMessages();
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (user?.uid) {
      await deleteMessage(user.uid, messageId);
      loadMessages();
    }
  };

  const handleClearMessages = async () => {
    if (user?.uid) {
      await clearMessages(user.uid);
      loadMessages();
    }
  };

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-white">Chat</h2>
          <Button variant="destructive" size="sm" onClick={handleClearMessages}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        </div>
        <ScrollArea className="h-[60vh] p-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onDelete={() => handleDeleteMessage(msg.id)}
              onClearChat={handleClearMessages}
            />
          ))}
        </ScrollArea>
        <div className="p-4 border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
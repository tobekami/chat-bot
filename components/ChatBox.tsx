"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebaseConfig";
import { saveMessage, getMessages, Message, clearMessages, deleteMessage } from "../lib/firestore";
import ChatMessage from "./ChatMessage";
import { useLanguage } from "./LanguageContext";

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

    loadMessages(); // Reload messages after sending
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (user?.uid) {
      await deleteMessage(user.uid, messageId);
      loadMessages(); // Reload messages after deleting
    }
  };

  const handleClearMessages = async () => {
    if (user?.uid) {
      await clearMessages(user.uid);
      loadMessages(); // Reload messages after clearing
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-lg">
      <div className="absolute w-fit min-h-screen bg-cover bg-center bg-fixed bg-[url('/images/image_no_bg.png')] opacity-30 -z-10" />
      <div className="flex flex-col space-y-4 overflow-y-auto" style={{ maxHeight: "70vh" }}>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onDelete={() => handleDeleteMessage(msg.id)} // Use handleDeleteMessage
            onClearChat={handleClearMessages} // Use handleClearMessages
          />
        ))}
      </div>
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
}

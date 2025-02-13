"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import io, { Socket } from "socket.io-client";
import { useChat } from "@/context/ChatContext";

type ChatMessage = {
  owner: boolean;
  content: string;
};

const ChatBox = () => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null); // ✅ Use ref to avoid unnecessary re-renders
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { selectedChat } = useChat();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/");
      return;
    }

    // Ensure WebSocket is only created once
    if (!socketRef.current) {
      const socketConnection = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:5001", {
        transports: ["websocket"],
        reconnectionAttempts: 3, // Try to reconnect 3 times
        reconnectionDelay: 1000, // Wait 1s before retrying
      });

      socketRef.current = socketConnection;

      socketConnection.on("connect", () => {
        console.log("✅ WebSocket connected:", socketConnection.id);
      });

      socketConnection.on("disconnect", () => {
        console.log("⚠️ WebSocket disconnected. Reconnecting...");
      });

      socketConnection.on("message", (message: ChatMessage) => {
        appendChat(message);
      });

      socketConnection.on("connect_error", (err) => {
        console.error("❌ WebSocket Connection Error:", err);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // Clean up reference on unmount
      }
    };
  }, [router, selectedChat]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const { id } = JSON.parse(user);
    const storedChat = localStorage.getItem(`chatMessages_${selectedChat}-${id}`);
    setChat(storedChat ? JSON.parse(storedChat) : []);
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const appendChat = (message: ChatMessage) => {
    setChat((prevChat) => {
      const updatedChat = [...prevChat, message];
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          const { id } = JSON.parse(user);
          localStorage.setItem(`chatMessages_${selectedChat}-${id}`, JSON.stringify(updatedChat));
        }
      }
      return updatedChat;
    });
  };

  const sendMessage = (message: ChatMessage) => {
    appendChat(message);
    if (socketRef.current) {
      socketRef.current.emit("message", message);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="relative flex flex-col h-[90vh]">
      <div className="flex-grow overflow-y-scroll px-4 pb-4 sm:px-6 lg:px-10 bg-white dark:bg-transparent text-black dark:text-white">
        {chat.map((message, index) => (
          <ChatBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-gray-100 dark:bg-background text-slate-black dark:text-slate-200">
        <ChatInput appendChat={sendMessage} />
      </div>
    </div>
  );
};

export default ChatBox;

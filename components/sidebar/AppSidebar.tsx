"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ScrollArea } from "../ui/scroll-area";

export function AppSidebar() {
  const [chats, setChats] = useState<string[] | null>(null); // 🔥 Avoid SSR mismatch
  const { selectedChat, setSelectedChat } = useChat();

  useEffect(() => {
    const storedChats = localStorage.getItem("chats");
    setChats(storedChats ? JSON.parse(storedChats) : ["Chat 1"]);
  }, []);

  useEffect(() => {
    if (chats) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);

  const addChat = () => {
    if (chats) {
      setChats([...chats, `Chat ${chats.length + 1}`]);
    }
  };

  // 🔥 Prevent SSR mismatch by rendering only when chats are loaded
  if (chats === null) return null;

  return (
    <Sidebar className="bg-gray-100 dark:bg-gray-900">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center justify-between w-full py-4">
              <p className="text-xl">Chats</p>
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex justify-center">
              <button
                onClick={addChat}
                className="flex items-center justify-center w-11/12 p-2 my-4 bg-gray-200 dark:bg-gray-800 rounded-xl"
              >
                Add Chat
              </button>
            </div>
            <SidebarMenu className="h-[82vh] overflow-y-auto">
              <ScrollArea>
                {chats.map((chat: string, index: number) => (
                  <SidebarMenuItem
                    key={index}
                    className="px-2 pb-1 "
                    onClick={() => setSelectedChat(index)}
                  >
                    <SidebarMenuButton asChild>
                      <div
                        className={`flex items-center justify-start w-full p-4 rounded-xl ${
                          selectedChat === index
                            ? "bg-gray-300 dark:bg-gray-800 "
                            : ""
                        }`}
                      >
                        <span className="text-center pl-5">{chat}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </ScrollArea>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

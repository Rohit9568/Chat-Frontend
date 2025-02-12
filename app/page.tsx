"use client";
import ChatBox from "@/components/chat/ChatBox";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  });
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <ChatBox />
        </div>
      </SidebarProvider>
    </div>
  );
}

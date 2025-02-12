"use client";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 dark:bg-background border-b dark:border-gray-800">
      <SidebarTrigger />
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        ChatApp 
      </h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-200 dark:bg-gray-700 
                  hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

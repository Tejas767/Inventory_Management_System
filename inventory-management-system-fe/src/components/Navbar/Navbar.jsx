"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Box,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  const navItems = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Products", icon: Box, href: "/product" },
    { name: "Employees", icon: Users, href: "/employee" },
    { name: "Queries", icon: MessageSquare, href: "/queries" },
  ];

  // 🔹 LOGIC CHANGE: Optimized User Fetching
  useEffect(() => {
    const fetchUser = async () => {
  

      // 1. FAST LOAD: Check Local Storage first
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.name) {
            setUserName(parsedUser.name);
          }
        } catch (e) {
          console.error("Error parsing stored user", e);
        }
      }


    };

    fetchUser();
  }, []);

  // 🔹 LOGIC CHANGE: Safer Logout

  const handleLogout = async () => {
     try {
       await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
       method: "POST",
       credentials: "include", // ✅ sends cookies
    });
  } catch (e) {
    console.error(e);
  }

  localStorage.removeItem("user"); // ✅ clear user info
  toast.success("Logged Out Successfully");
  router.push("/login"); // ✅ redirect
};
  




  return (
    <header className="bg-white h-16 flex items-center relative">
      <div className="w-full max-w-350 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6 lg:gap-10">
          <h1 className="text-[20px] font-extrabold text-black cursor-pointer">
            Inventory Manager
          </h1>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Logic Change: active state checks if path *starts with* href for sub-pages
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 pb-4 mt-6 border-b-2 text-sm font-bold transition-all
                    ${
                      isActive
                        ? "border-blue-600 text-black"
                        : "border-transparent text-gray-500 hover:text-black"
                    }
                  `}
                >
                  <Icon size={15} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            Welcome,{" "}
            <span className="font-medium text-black">
              {userName}
            </span>
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-[12px] font-medium hover:bg-blue-700 transition duration-300 hover:bg-[#6A4DE6]  hover:scale-105"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* MOBILE ICON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? (
            <X size={26} className="text-black" />
          ) : (
            <Menu size={26} className="text-black" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t px-6 py-6 space-y-6 z-50 text-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`w-full flex items-center justify-center gap-3 pb-2 border-b-2 text-sm font-bold
                  ${
                    isActive
                      ? "border-blue-600 text-black"
                      : "border-transparent text-gray-500"
                  }
                `}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Welcome,{" "}
              <span className="font-medium text-black">
                {userName}
              </span>
            </p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-md text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
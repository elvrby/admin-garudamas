// components/layout/navbar.tsx
"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/libs/firebase/config";

const Sidebar: React.FC<{ onToggle: (isOpen: boolean) => void }> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const asideRef = useRef<HTMLDivElement>(null);

  // Set CSS var --sb-w sesuai lebar NYATA sidebar (px)
  const updateSidebarVar = () => {
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches; // lg breakpoint Tailwind
    if (!isDesktop) {
      document.documentElement.style.setProperty("--sb-w", "0px");
      return;
    }
    const w = asideRef.current?.offsetWidth ?? 0;
    document.documentElement.style.setProperty("--sb-w", `${w}px`);
  };

  useEffect(() => {
    updateSidebarVar(); // on mount
    const onWinResize = () => updateSidebarVar();
    window.addEventListener("resize", onWinResize);

    const ro = new ResizeObserver(() => updateSidebarVar());
    if (asideRef.current) ro.observe(asideRef.current);

    return () => {
      window.removeEventListener("resize", onWinResize);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateSidebarVar(); // setiap kali toggle
  }, [isOpen]);

  const toggleSidebar = () => {
    const next = !isOpen;
    setIsOpen(next);
    onToggle(next);
  };

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      window.location.href = "/";
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const menuItems = [
    {
      href: "/ticketing",
      label: "Tambahkan Tiket",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
        </svg>
      ),
    },
    {
      href: "/admin/pesanan",
      label: "Pesanan",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      href: "/admin/voucher",
      label: "Voucher",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16v3a2 2 0 010 4v3H4v-3a2 2 0 010-4V8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10v4M16 10v4" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        ref={asideRef}
        className={[
          "fixed top-16 left-0 z-30 h-[calc(100vh-64px)] overflow-hidden",
          "bg-gradient-to-b from-black to-black border-r border-slate-700/50 shadow-2xl",
          "transition-all duration-300 ease-in-out",
          // OPEN: mobile 4/5, sm 3/5, desktop 1/5 (20%); CLOSED: w-16
          isOpen ? "w-4/5 sm:w-3/5 md:w-1/5 max-w-md" : "w-16",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          {/* Toggle */}
          <div className="flex items-center justify-end p-4">
            <button
              onClick={toggleSidebar}
              className="rounded-lg border border-slate-600/50 bg-gray-950 p-2 shadow-md transition-all duration-200 hover:scale-105 hover:bg-slate-700"
              aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
              title={isOpen ? "Tutup" : "Buka"}
            >
              <svg className={`h-5 w-5 text-slate-300 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Header (hide saat collapsed) */}
          {isOpen && (
            <div className="px-6 pb-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4l3 6 6 .5-4.5 4 1.5 6L12 17l-6 3.5 1.5-6L3 10.5 9 10l3-6z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                  <p className="text-sm text-slate-400">Management System</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu */}
          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group block">
                    <div
                      className={[
                        "flex items-center rounded-xl border border-transparent",
                        "transition-all duration-200 hover:scale-[1.02] hover:border-slate-600/30 hover:bg-slate-700/50 hover:shadow-lg",
                        isOpen ? "px-4 py-3" : "justify-center px-3 py-3",
                      ].join(" ")}
                    >
                      <span className="flex-shrink-0 text-slate-300 transition-colors group-hover:text-white">{item.icon}</span>
                      {isOpen && <span className="ml-3 whitespace-nowrap font-medium text-slate-300 transition-colors group-hover:text-white">{item.label}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout di paling bawah */}
          <div className="border-t border-slate-700/50 p-4">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={[
                "flex w-full items-center rounded-xl px-4 py-3 text-left transition-all",
                isOpen ? "justify-start" : "justify-center",
                "text-red-400 hover:bg-red-500/30 hover:text-white",
              ].join(" ")}
            >
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4-4-4M21 12H7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16a2 2 0 002 2h4a2 2 0 002-2v-1" />
              </svg>
              {isOpen && <span className="ml-2 font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Modal konfirmasi logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Apakah Anda yakin ingin keluar?</h2>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={handleLogout} className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700">
                Yes
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

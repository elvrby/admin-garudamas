// app/components/ClientShell.tsx
"use client";

import React, { useState } from "react";
import Header from "../layout/header";
import Navbar from "../layout/navbar";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Header />
      <Navbar onToggle={setSidebarOpen} />
      <main className="transition-[margin] duration-10 p-4 sm:p-6 lg:p-8" style={{ marginLeft: "var(--sb-w, 0px)" }}>
        {children}
      </main>
    </>
  );
}

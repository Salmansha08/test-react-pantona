"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/toogle-theme";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [defaultOpen, setDefaultOpen] = useState(true);

  useEffect(() => {
    const sidebarState = localStorage.getItem("sidebar_state");
    setDefaultOpen(sidebarState === "true");
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex-1 p-6 bg-white dark:bg-slate-900">
        <div className="flex justify-between items-center mb-4">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { PropsWithChildren } from "react";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentUser } from "@/server/user";
import { redirect } from "next/navigation";

const DashboardLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");
  return (
    <SidebarProvider>
      <div className="w-full h-screen flex ">
        <Sidebar data={user} />
        <div className="flex-1 w-full h-screen overflow-hidden">
          <Header />
          <div className="w-full h-full p-4">
            <ScrollArea className="overflow-y-auto w-full h-full">
              {children}
            </ScrollArea>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

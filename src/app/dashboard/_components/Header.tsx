import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import Breadcrumb from "./Breadcrumb";

const Header = () => {
  return (
    <header className="w-full h-10 bg-sidebar border-b flex items-center justify-start px-2 space-x-2">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <Breadcrumb />
    </header>
  );
};

export default Header;

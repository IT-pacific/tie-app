import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import SideBar from "@/components/common/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-row relative">
      <SideBar />
      <main className="flex-1 flex flex-col w-full xl:w-[calc(100%-270px)]">
        <Navbar />
        <div className="flex-1 h-[calc(100vh - 66px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

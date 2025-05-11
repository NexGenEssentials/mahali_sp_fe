"use client";

import React, { ReactNode } from "react";
import Topbar from "../components/Topbar";
import { useAppContext } from "../context";
import Sidebar from "../components/Sidebar";

const ServiceProviderTemplate = ({ children }: { children: ReactNode }) => {
  const { expanded } = useAppContext();
  return (
    <>
      <Sidebar />
      <div className={`${expanded ? "pl-64" : "pl-20"} mx-4`}>
        <Topbar />
        <div className=" bg-gray-100 p-6 min-h-[90vh] rounded-lg">
          {children}
        </div>
      </div>
    </>
  );
};

export default ServiceProviderTemplate;

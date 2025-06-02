"use client";

import React, { ReactNode } from "react";
import Topbar from "../components/Topbar";
import { useAppContext } from "../context";
import Sidebar from "../components/Sidebar";

const ServiceProviderTemplate = ({ children }: { children: ReactNode }) => {
  const { expanded } = useAppContext();
  return (
    <div
      className={`${
        expanded ? "pl-64" : "pl-20"
      } mx-4 bg-gray-100 min-h-[90vh] pt-6 rounded-lg`}
    >
      {children}
    </div>
  );
};

export default ServiceProviderTemplate;

"use client";
import React from "react";
import AnalyticsPage from "../components/analytics/analytics";
import ServiceProviderTemplate from "./serviceProviderTemplate";

const Dashboard = () => {
  return <ServiceProviderTemplate children={<AnalyticsPage />} />;
};

export default Dashboard;

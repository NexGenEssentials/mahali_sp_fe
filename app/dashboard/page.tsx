"use client";
import React from "react";
import ServiceProviderTemplate from "./serviceProviderTemplate";
import AnalyticsPage from "../components/analytics/analyticsServiceProvider";

const Dashboard = () => {
  return <ServiceProviderTemplate children={<AnalyticsPage />} />;
};

export default Dashboard;

"use client";
import React from "react";
import ServiceProviderTemplate from "./serviceProviderTemplate";
import AnalyticsPage from "../components/analytics/analyticsServiceProvider";
import { useAppContext } from "../context";
import AdminAnalyticsPage from "../components/analytics/analyticsAdmin";

const Dashboard = () => {
  const { userRole } = useAppContext();

  return (
    <ServiceProviderTemplate>
      {userRole === "admin" ? <AdminAnalyticsPage /> : <AnalyticsPage />}
    </ServiceProviderTemplate>
  );
};

export default Dashboard;

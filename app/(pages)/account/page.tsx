import { ServiceProviderForm } from "@/app/components/form/serviceProvider";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const AccountPage = () => {
  return <ServiceProviderTemplate children={<ServiceProviderForm />} />;
};

export default AccountPage;

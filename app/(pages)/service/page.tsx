import ServiceDetails from "@/app/components/service/service";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const ServicePage = () => {
  return <ServiceProviderTemplate children={<ServiceDetails />} />;
};

export default ServicePage;

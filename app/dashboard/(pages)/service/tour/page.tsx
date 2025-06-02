import TourForm from "@/app/components/service/tour/createTourForm";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const CreateCar = () => {
  return <ServiceProviderTemplate children={<TourForm />} />;
};

export default CreateCar;

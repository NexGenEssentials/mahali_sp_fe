import AccommodationForm from "@/app/components/service/accommodation/createAccomodation";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const CreateCar = () => {
  return <ServiceProviderTemplate children={<AccommodationForm />} />;
};

export default CreateCar;

import { Card } from "@/app/components/card/card";
import AddVehicleForm from "@/app/components/service/car/createCar";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const CreateCar = () => {
  return <ServiceProviderTemplate children={<AddVehicleForm />} />;
};

export default CreateCar;

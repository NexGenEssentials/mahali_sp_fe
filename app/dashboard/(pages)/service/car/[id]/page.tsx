"use client";
import EditCarPage from "@/app/components/service/car/editCar";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React from "react";

const EditCar = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <ServiceProviderTemplate>
      <EditCarPage carId={id} />
    </ServiceProviderTemplate>
  );
};

export default EditCar;

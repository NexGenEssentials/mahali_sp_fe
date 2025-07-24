"use client";
import EditAccommodationForm from "@/app/components/service/accommodation/editAccommodation";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React, { useState } from "react";
import { RiEditFill } from "react-icons/ri";

const EditAccommodation = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <ServiceProviderTemplate>
      <EditAccommodationForm id={id} />
    </ServiceProviderTemplate>
  );
};

export default EditAccommodation;

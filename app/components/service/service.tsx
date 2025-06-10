"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import AdminTourServiceApp from "./tour/adminTour";
import AdminCarRentalApp from "./car/adminCar";
import AdminAccommodationTable from "./accommodation/accommodation";
import CustomPackage from "./customPackage/customPackage";

export const ServiceList = [
  {
    icon: "octicon:package-16",
    title: "Holiday & Tour Packages",
  },
  {
    icon: "ri:hotel-line",
    title: "Accommodations",
  },
  {
    icon: "mingcute:car-3-fill",
    title: "Car Rentals",
  },
  {
    title: "Custom Packages",
    icon: "fa-solid:suitcase-rolling",
  },
];
const ServiceDetails = () => {
  const [adminServiceTab, setAdminServiceTab] = useState<string>(
    "Holiday & Tour Packages"
  );

  return (
    <div>
      <ul className=" flex gap-2 border-b-2 w-fit">
        {ServiceList.map((service, index) => (
          <li
            key={index}
            onClick={() => setAdminServiceTab(service.title)}
            className={`cursor-pointer flex items-center gap-4 p-3  transition-all duration-300 ${
              adminServiceTab === service.title
                ? "border-b-primaryGreen border-b-2"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <Icon icon={service.icon} width="20" height="20" />
            <span className="text-sm font-semibold">{service.title}</span>
          </li>
        ))}
      </ul>

      {adminServiceTab === "Holiday & Tour Packages" && <AdminTourServiceApp />}
      {adminServiceTab === "Car Rentals" && <AdminCarRentalApp />}
      {adminServiceTab === "Accommodations" && <AdminAccommodationTable />}
      {adminServiceTab === "Custom Packages" && <CustomPackage />}
    </div>
  );
};

export default ServiceDetails;

"use client";

import CreateDestinationPage from "@/app/components/destination/createCountry";
import CreatHighlights from "@/app/components/destination/createhighlights";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React, { useState } from "react";

const EditCountriesPage = () => {
  const [active, setAcctive] = useState("create country");
  const tabs = ["create country", "create highlight"];
  return (
    <ServiceProviderTemplate>
      <div className="flex justify-center gap-8 border-b  items-center mb-4 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setAcctive(tab)}
            className={`flex items-center gap-2 text-start pb-2 capitalize font-semibold ${
              active === tab
                ? "border-primaryGreen border-b-2 text-primaryGreen"
                : "text-gray-400 "
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full">
        {active === "create country" && <CreateDestinationPage />}
        {active === "create highlight" && <CreatHighlights />}
      </div>
    </ServiceProviderTemplate>
  );
};

export default EditCountriesPage;

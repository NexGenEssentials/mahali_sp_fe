"use client";

import AddTourImages from "@/app/components/service/tour/addTourImages";
import EditTourImages from "@/app/components/service/tour/editTourImages";
import EditTourInformation from "@/app/components/service/tour/editTourInformation";
import EditTourPlan from "@/app/components/service/tour/editTourPlan";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React, { useState } from "react";
import { RiEditFill } from "react-icons/ri";

const CreateCar = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const [active, setAcctive] = useState("edit tour information");
  const tabs = ["edit tour information", "edit tour plan", "edit tour images"];
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
            <RiEditFill />
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full">
        {active === "edit tour information" && <EditTourInformation id={id} />}
        {active === "edit tour plan" && <EditTourPlan id={id} />}
        {active === "edit tour images" && <AddTourImages tourId={id} />}
      </div>
    </ServiceProviderTemplate>
  );
};

export default CreateCar;

"use client";

import { message } from "antd";
import React, { useEffect, useState } from "react";
import Loader from "../../skeleton/loader";
import {
  CreateNewFacility,
  facility,
  getFacilities,
} from "@/app/api/accommodation/action";

interface FacilityType {
  id: number;
  name: string;
}

const CreateFacilities = ({
  setFacilities,
}: {
  setFacilities: (values: FacilityType[]) => void;
}) => {
  const [facilityList, setFacilitiesList] = useState<facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<FacilityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFacility, setNewFacility] = useState<string>("");

  useEffect(() => {
    handleGetFacilities();
  }, []);

  const handleGetFacilities = async () => {
    try {
      const result = await getFacilities();

      if (result.success) {
        setFacilitiesList(result.data);
        setLoading(false);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const updatedFacility = checked
      ? [...selectedFacility, facilityList.find((f) => f.id === Number(value))!]
      : selectedFacility.filter((f) => f.id !== Number(value));

    setSelectedFacility(updatedFacility);
    setFacilities(updatedFacility);
  };

  const handleCreateNewFacilityChange = async () => {
 
    if (newFacility.trim() === "") {
      message.error("Facility name cannot be empty");
      return;
    }
       setLoading(true);

    try {
      const result = await CreateNewFacility(newFacility);

      if (result.success) {
        message.success("Facility added successfully");
        setFacilitiesList((prev) => [
          ...(prev || []),
          { id: result.data.id, name: result.data.name },
        ]);
      }
    } catch (error) {
      message.error("Error adding new Facility");
    } finally {
      setNewFacility("");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Select a facility</h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {facilityList.map((facility, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                value={facility.id}
                checked={selectedFacility.some(
                  (selected) => selected.id === facility.id
                )}
                onChange={handleFacilityChange}
                className="accent-primaryGreen"
              />
              <span className="text-sm text-gray-700">{facility.name}</span>
            </label>
          ))}
        </div>
      )}
      <div className="mt-4 border-t pt-4">
        <h4 className="font-medium text-gray-700 mb-2">Add New Facility</h4>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <input
            type="text"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            placeholder="Enter new Facility name"
            className="w-full md:w-auto flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
          />
          <button
            className="bg-primaryGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            onClick={handleCreateNewFacilityChange}
          >
            Add Facility
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFacilities;

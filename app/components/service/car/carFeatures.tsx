"use client";

import { CreateNewFeature, getCarFeatures } from "@/app/api/carRental/action";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import Loader from "../../skeleton/loader";

interface Feature {
  id: number;
  name: string;
}

const CarFeatures = ({
  setFeatures,
}: {
  setFeatures: (values: Feature[]) => void;
}) => {
  const [featuresList, setFeaturesList] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFeature, setNewFeature] = useState<string>("");

  useEffect(() => {
    handleGetCarFeatures();
  }, []);

  const handleGetCarFeatures = async () => {
    try {
      const response = await getCarFeatures();
      if (response && Array.isArray(response)) {
        setFeaturesList(response);
      } else {
        message.error("Invalid feature data received");
      }
    } catch (error) {
      message.error("Error fetching car features");
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const updatedFeatures = checked
      ? [...selectedFeatures, featuresList.find((f) => f.id === Number(value))!]
      : selectedFeatures.filter((f) => f.id !== Number(value));

    setSelectedFeatures(updatedFeatures);
    setFeatures(updatedFeatures);
  };

  const handleCreateNewFeatureChange = async () => {
    setLoading(true);
    if (newFeature.trim() === "") {
      message.error("Feature name cannot be empty");
      return;
    }

    try {
      const result = await CreateNewFeature(newFeature);

      if (result) {
        message.success("Feature added successfully");
        setFeaturesList((prev) => [
          ...prev,
          { id: result.id, name: result.name },
        ]);
      }
    } catch (error) {
      message.error("Error adding new feature");
    } finally {
      setNewFeature("");
      setNewFeature("");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Select Car Features</h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {featuresList.map((feature) => (
            <label
              key={feature.id}
              className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                value={feature.id}
                checked={selectedFeatures.some(
                  (selected) => selected.id === feature.id
                )}
                onChange={handleFeatureChange}
                className="accent-primaryGreen"
              />
              <span className="text-sm text-gray-700">{feature.name}</span>
            </label>
          ))}
        </div>
      )}
      <div className="mt-4 border-t pt-4">
        <h4 className="font-medium text-gray-700 mb-2">Add New Feature</h4>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Enter new feature name"
            className="w-full md:w-auto flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
          />
          <button
            className="bg-primaryGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            onClick={handleCreateNewFeatureChange}
          >
            Add Feature
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarFeatures;

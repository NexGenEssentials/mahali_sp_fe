"use client";
import { CreateActivities } from "@/app/api/tour/action";
import { useAppContext } from "@/app/context";
import message from "antd/es/message";
import React, { useState } from "react";
import { PriceItemType } from "@/app/types/service/tour";

export interface ActivityFormData {
  name: string;
  category_id: number;
  prices: PriceItemType[];
  location: string;
  description: string;
}

interface CreateTourActivityFormProps {
  catId: number;
  reload: (load: boolean) => void;
}

const CreateTourActivityForm = ({
  catId,
  reload,
}: CreateTourActivityFormProps) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    name: "",
    category_id: catId,
    prices: [],
    location: "",
    description: "",
  });
  const [save, setSave] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setActiveModalId } = useAppContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    nationality: string
  ) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => {
      const updatedPrices = [...prev.prices];
      const index = updatedPrices.findIndex(
        (item) => item.nationality_type === nationality
      );
      if (index !== -1) {
        updatedPrices[index].price_per_day = value;
      } else {
        updatedPrices.push({
          nationality_type: nationality,
          price_per_day: value,
        });
      }
      return { ...prev, prices: updatedPrices };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (save) {
      setSaveLoading(true);
    } else {
      setLoading(true);
    }
    try {
      const result = await CreateActivities(formData);
      if (result.success) {
        message.success("Activity created successfully:");
        reload(true);
        if (save) {
          setActiveModalId(null);
        }
      } else {
        message.error("Failed to create activity:");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      setSaveLoading(false);
      setFormData({
        name: "",
        category_id: catId,
        prices: [],
        location: "",
        description: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl min-w-[400px] mx-auto p-6 bg-white overflow-y-scroll h-[80vh] "
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create Tour Activity
      </h2>
      <div className="mb-4">
        <label htmlFor="name" className="block font-medium text-gray-700 mb-2">
          Activity Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Activity Name"
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="p-6 border rounded-md bg-gray-50 space-y-6">
        <h2 className="font-bold text-xl text-primaryGreen">Pricing Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Rwandan", type: "RWANDA" },
            { label: "East African", type: "EAST_AFRICA" },
            {
              label: "Foreign Residence in Rwanda",
              type: "FOREIGN_RESIDENCE_RW",
            },
            { label: "African", type: "AFRICAN" },
            { label: "International", type: "INTERNATIONAL" },
          ].map((item, index) => {
            const existingPrice =
              formData.prices.find(
                (price) => price.nationality_type === item.type
              )?.price_per_day ?? "";

            return (
              <div key={index} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {item.label}
                </label>
                <input
                  type="number"
                  value={existingPrice}
                  onChange={(e) => handlePriceChange(e, item.type)}
                  placeholder="$ 00.00"
                  required
                  className="w-full border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="my-4">
        <label
          htmlFor="location"
          className="block font-medium text-gray-700 mb-2"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="activity location"
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter activity description..."
          rows={3}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex flex-col items-center justify-between gap-3 ">
        <button
          onClick={() => setSave(true)}
          type="submit"
          disabled={saveLoading}
          className={`w-full py-2 px-4 rounded-md text-white transition ${
            saveLoading
              ? "bg-green-500 opacity-50 cursor-not-allowed"
              : "bg-primaryGreen hover:bg-green-600"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white transition ${
            loading
              ? "bg-green-500 opacity-50 cursor-not-allowed"
              : "bg-primaryGreen hover:bg-green-600"
          }`}
        >
          {loading ? "Saving..." : "Save & Add Another"}
        </button>
      </div>
    </form>
  );
};

export default CreateTourActivityForm;

"use client";
import { CreateActivities } from "@/app/api/tour/action";
import message from "antd/es/message";
import React, { useState } from "react";

export interface ActivityFormData {
  name: string;
  category_id: number;
  price_per_day: number;
  location: string;
  description: string;
}

interface CreateTourActivityFormProps {
  catId: number;
}

const CreateTourActivityForm = ({ catId }: CreateTourActivityFormProps) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    name: "",
    category_id: catId,
    price_per_day: 0,
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price_per_day" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Submitted Activity Data:", formData);

      const result = await CreateActivities(formData);
      if (result.success) {
        message.success("Activity created successfully:");
      } else {
        message.error("Failed to create activity:");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);

      setFormData({
        name: "",
        category_id: catId,
        price_per_day: 0,
        location: "",
        description: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl min-w-[400px] mx-auto p-6 bg-white "
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
      <div className="mb-4">
        <label
          htmlFor="price_per_day"
          className="block font-medium text-gray-700 mb-2"
        >
          Price per Day
        </label>
        <input
          type="number"
          step="0.01"
          id="price_per_day"
          name="price_per_day"
          value={formData.price_per_day}
          onChange={handleChange}
          placeholder="50.00"
          required
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="mb-4">
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
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white transition ${
          loading
            ? "bg-green-500 opacity-50 cursor-not-allowed"
            : "bg-primaryGreen hover:bg-green-600"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CreateTourActivityForm;

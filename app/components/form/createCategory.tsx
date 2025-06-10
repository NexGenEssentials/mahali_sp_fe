"use client";
import { CreateCategories } from "@/app/api/tour/action";
import { message } from "antd";
import React, { useState } from "react";

const CreateTourCategoryForm = ({
  reload,
}: {
  reload: (load: boolean) => void;
}) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await CreateCategories(formData);
      if (result.success) {
        message.success("Category created successfully!");
        reload(true);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
      setFormData({ name: "", description: "" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl min-w-[400px] mx-auto p-6"
    >
      <h2 className="text-2xl mb-4 font-bold text-center">
        Create Tour Category
      </h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Hiking"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-medium mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description..."
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

export default CreateTourCategoryForm;

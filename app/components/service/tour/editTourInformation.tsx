"use client";

import { EditTourPackage, getSingleTour } from "@/app/api/tour/action";
import { CountryType, EditTourPackageType } from "@/app/types/service/tour";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { tourFormSchema } from "./createTourForm";
import { getAllCountry } from "@/app/api/destinations/action";
import message from "antd/es/message";
import Loader from "../../skeleton/loader";
import { Input } from "../../form/inputField";

const EditTourInformation = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState(true);
  const [countryList, setCountryList] = useState<CountryType[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTourPackageType>({
    mode: "onTouched",
  });

  useEffect(() => {
    fetchTourData();
    fetchCountries();
  }, []);

  const fetchTourData = async () => {
    try {
      const result = await getSingleTour(id.toString());
      if (result.success) {
        const tour = result.data;
        reset({
          title: tour.title,
          description: tour.description,
          location: tour.location,
          best_time_to_visit: tour.best_time_to_visit,
          duration_days: tour.duration_days,
          duration_nights: tour.duration_nights,
          min_people: tour.min_people,
          max_people: tour.max_people,
          rating: tour.rating,
          prices: tour.prices,
          is_active: tour.is_active,
          country: tour.country,
        });
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load tour data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const result = await getAllCountry();
      if (result.success) {
        setCountryList(result.data);
      }
    } catch (error) {
      message.error("Failed to load countries");
    }
  };

  const onSubmit = async (data: EditTourPackageType) => {
    try {
   
      const res = await EditTourPackage(data, id);

      if (res.success) {
        reset();
        message.success("Tour updated successfully!");
        router.push("/dashboard/tours");
      } else {
        message.error("Failed to update tour.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error("An unexpected error occurred.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] min-w-60">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Edit Tour Information</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 grid-cols-1 md:grid-cols-2"
      >
        {[
          { name: "title", label: "Title", type: "text" },
          { name: "location", label: "Location", type: "text" },
          {
            name: "best_time_to_visit",
            label: "Best Time to Visit",
            type: "text",
          },
          { name: "duration_days", label: "Duration (Days)", type: "number" },
          {
            name: "duration_nights",
            label: "Duration (Nights)",
            type: "number",
          },
          { name: "min_people", label: "Minimum People", type: "number" },
          { name: "max_people", label: "Maximum People", type: "number" },
          { name: "rating", label: "Rating (1-5)", type: "number" },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              {...register(name as keyof EditTourPackageType)}
              type={type}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            />
            {errors[name as keyof EditTourPackageType] && (
              <p className="text-red-500 text-sm mt-1">
                {(errors[name as keyof EditTourPackageType] as any)?.message}
              </p>
            )}
          </div>
        ))}

        <div className="p-6 border md:col-span-2 rounded-md bg-gray-50 space-y-6">
          <h2 className="font-bold text-xl text-primaryGreen">
            Pricing Section
          </h2>
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
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {item.label}
                </label>
                <Input
                  label=""
                  type="number"
                  error={errors.prices?.[index]?.price?.message}
                  placeholder="$ 00.00"
                  {...register(`prices.${index}.price`, {
                    valueAsNumber: true,
                  })}
                />

                <input
                  type="hidden"
                  value={item.type}
                  {...register(`prices.${index}.nationality_type`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description field (full width) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Country Select */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            {...register("country")}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          >
            <option value="">Select Country</option>
            {countryList.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* Is Active Checkbox */}
        <div className="md:col-span-2 flex items-center space-x-3">
          <input
            type="checkbox"
            {...register("is_active")}
            className="h-4 w-4 accent-primaryGreen border-gray-300 rounded"
          />
          <label className="block text-sm font-bold text-gray-700">
            Is Active
          </label>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 flex justify-center ">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-1/2 hover:bg-primaryGreen border border-primaryGreen text-primaryGreen px-6 py-2 rounded-full hover:text-white transition"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTourInformation;

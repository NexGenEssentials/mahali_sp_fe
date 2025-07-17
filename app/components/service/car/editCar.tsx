"use client";
import {
  CreateCarFeatures,
  CreateCarImages,
  EditCar,
  getSingleCar,
} from "@/app/api/carRental/action";
import { EditSingleCarType } from "@/app/types/service";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../../skeleton/loader";
import { ImagePlus, X } from "lucide-react";
import CarFeatures from "./carFeatures";
import { carBrands, carTypesData } from "@/app/costant";
import Switch from "antd/es/switch";
import { useDropzone } from "react-dropzone";
import message from "antd/es/message";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/context";

const EditCarPage = ({ carId }: { carId: number }) => {
  const router = useRouter();
  const { setActiveModalId } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [submiting, setSubmiting] = useState(false);
  const [features, setFeatures] = useState<{ id: number; name: string }[]>([]);
  const [open, setOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },

    multiple: true,
    onDrop: (files) => {
      const file = files.map((file) => URL.createObjectURL(file));

      setImageFile((prev) => [...prev, ...files]);
      setImagePreview((prev) => [...prev, ...file]);
    },
  });

  const removeImage = (index: number) => {
    const updatedImages = [...imageFile];
    const updatedPreviews = [...imagePreview];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImageFile(updatedImages);
    setImagePreview(updatedPreviews);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSingleCarType>({ mode: "onTouched" });

  useEffect(() => {
    getCarById();
  }, []);

  const getCarById = async () => {
    setLoading(true);
    try {
      const result = await getSingleCar(String(carId));
      if (result) {
        setFeatures(result.features || []);
        reset({
          owner: result.owner,
          name: result.name,
          brand: result.brand,
          location: result.location,
          category: result.category,
          year: result.year,
          mileage: result.mileage,
          fuel_type: result.fuel_type,
          transmission: result.transmission,
          seats: result.seats,
          luggage_capacity: result.luggage_capacity,
          price_per_day: result.price_per_day,
          is_available: result.is_available,
          description: result.description,
        });

        setImagePreview(result.images || []);
        setImageFile(result.images?.map((img) => new File([], img)) || []);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: EditSingleCarType) => {
    try {
      if (imageFile.length === 0) {
        message.warning("Please select at least one image.");
        return;
      }
      if (features.length === 0) {
        message.warning("Please select at least one feature.");
        return;
      }

      setSubmiting(true);

      const formData = new FormData();
      imageFile.forEach((image, index) => {
        formData.append("image", image);
      });

      // edit car information

      const result = await EditCar(carId, data);
   
      if (result.status === "success") {
        message.error("Failed to update car details");
      } else {
        message.success("Car details updated successfully");
      }

      // add features

      const featuresIds = features.map((feature) => feature.id);
      const res = await CreateCarFeatures(featuresIds, carId);
      if (!res.success) {
        message.error("Failed to upload features");
      } else {
        message.success("Features uploaded successfully");
        setFeatures([]);
      }

      //   Upload image

      const response = await CreateCarImages(formData, carId);

      if (!response.success) {
        message.error("Failed to upload image");
      } else {
        message.success("Image uploaded successfully");

        router.push("/dashboard/service");
      }

    } catch (error) {
      //   console.error("Error submitting form:", error);
      message.error("Failed to update car details");
    } finally {
      reset();
      setActiveModalId(null);
      setSubmiting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] min-w-60">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Car Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 "
      >
        {/* Standard Fields */}
        {[
          { name: "name", label: "Name", type: "text", required: true },

          { name: "location", label: "Location", type: "text", required: true },
          { name: "year", label: "Year", type: "number", required: true },
          {
            name: "mileage",
            label: "Mileage (km)",
            type: "number",
            required: true,
          },
          { name: "seats", label: "Seats", type: "number", required: true },
          {
            name: "luggage_capacity",
            label: "Luggage Capacity",
            type: "number",
          },
          {
            name: "price_per_day",
            label: "Price per Day (USD)",
            type: "text",
            required: true,
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-semibold mb-1">{field.label}</label>
            <input
              {...register(field.name as keyof EditSingleCarType, {
                required: field.required ? `${field.label} is required` : false,
              })}
              type={field.type}
              className="w-full border p-2 rounded"
            />
            {errors[field.name as keyof EditSingleCarType] && (
              <p className="text-red-500 text-sm mt-1">
                {
                  (errors[field.name as keyof EditSingleCarType] as any)
                    ?.message
                }
              </p>
            )}
          </div>
        ))}

        {/* Dropdown Fields */}
        <>
          <div>
            <label htmlFor="category" className="block font-semibold mb-1">
              Category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full border p-2 rounded"
            >
              <option value="" disabled>
                Select a category
              </option>

              {carTypesData.car_types.map((type, index) => (
                <option key={index} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brand" className="block font-semibold mb-1">
              Brand
            </label>
            <select id="brand" {...register("brand")} className="input">
              <option value="" disabled>
                Select a brand
              </option>
              {carBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Fuel Type</label>
            <select
              {...register("fuel_type")}
              className="w-full border p-2 rounded"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Transmission</label>
            <select
              {...register("transmission")}
              className="w-full border p-2 rounded"
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          {/* Availability Checkbox */}

          <div className="flex items-center justify-between gap-2 border p-2 rounded-md">
            <div>
              <span className="flex items-center gap-2">
                Available for Rent
              </span>
              <span className="text-sm text-gray-500">
                Mark this vehicle as available
              </span>
            </div>

            <Switch
              className=""
              defaultChecked
              onChange={(checked) => {
                const event = {
                  target: { name: "is_available", value: checked },
                };
                register("is_available").onChange(event);
              }}
            />
          </div>
        </>

        {/* Features Section */}
        <div className="space-y-2 col-span-2">
          <div className="relative flex items-center justify-between border-b pb-1">
            <h3 className="text-lg font-semibold">Features</h3>
            <button
              onClick={() => setOpen(!open)}
              type="button"
              className=" text-primaryGreen hover:bg-primaryGreen hover:text-white font-bold duration-300 border border-primaryGreen rounded-md px-2 py-1"
            >
              {open ? "Close Model" : " + Add Features"}
            </button>
            {open && (
              <div className="absolute top-9 border right-0 bg-white shadow-md rounded-md p-4 z-10">
                <CarFeatures
                  setFeatures={(selected) => setFeatures(selected)}
                />
              </div>
            )}
          </div>
          {features.length > 0 ? (
            <div className="text-gray-500 min-h-20 rounded-md p-4 border w-full max-h-48 overflow-y-scroll hide-scrollbar bg-gray-50">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-2"
                >
                  <span className="text-gray-700">{feature.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFeatures((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 min-h-20 rounded-md p-4 border w-full italic">
              No features selected
            </p>
          )}
        </div>

        {/* Gallery Image Upload */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-1">Car Images</h3>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${
              isDragActive
                ? "border-slate-500 bg-blue-50"
                : "hover:border-primaryGreen"
            }`}
          >
            <input {...getInputProps()} />
            <ImagePlus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Drag & drop or click to upload
            </p>
          </div>

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagePreview.map((preview, index) => (
                <div
                  key={index}
                  className="relative group aspect-video rounded overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 flex justify-center ">
          <button
            type="submit"
            className="w-1/2 hover:bg-primaryGreen border border-primaryGreen text-primaryGreen px-6 py-2 rounded-full hover:text-white transition"
          >
            {submiting ? "saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCarPage;

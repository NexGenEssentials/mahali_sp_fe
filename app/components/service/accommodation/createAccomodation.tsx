"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "../../form/inputField";
import { useAppContext } from "@/app/context";
import { X } from "lucide-react";
import CenterModal from "../../model/centerModel";
import CreateFacilities from "./facility";
import message from "antd/es/message";
import {
  CreateAccommodationImage,
  CreateAccomodation,
} from "@/app/api/accommodation/action";
import { useRouter } from "next/navigation";


const accommSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(0).max(5),
  facility_ids: z.array(z.number()).optional(),
  tags: z.string().optional(),
  check_in_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  check_out_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  smoking_allowed: z.boolean(),
  pets_allowed: z.boolean(),
  additional_rules: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  image: z.instanceof(File).nullable(),
});

export type AccommFormData = z.infer<typeof accommSchema>;

const AccommodationForm: React.FC = () => {
  const { setActiveModalId } = useAppContext();
  const router = useRouter();
  const [selectedFacilities, setSelectedFacilities] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AccommFormData>({
    resolver: zodResolver(accommSchema),
    defaultValues: {
      facility_ids: [],
      is_active: true,
      is_featured: false,
      rating: 0,
      smoking_allowed: false,
      pets_allowed: false,
      image: null, // Default value for image
    },
  });

  const onSubmit = async (data: AccommFormData) => {
    setLoading(true);
    try {
      const facilityIds = selectedFacilities.map((f) => f.id);

      const imageData = new FormData();

      const formData: AccommFormData = {
        ...data,
        image: null,
        facility_ids: facilityIds,
      };
      
      const result = await CreateAccomodation(formData);

      if (!result) {
        message.error("Failed to create accommodation. Please try again.");
        return;
      }
      if (result.success) {
        message.success("Accommodation created successfully!");
        router.push("/dashboard/service");
        if (image) {
          imageData.append("image", image);
          imageData.append("accommodation", result.data.id.toString());
        }
        const response = await CreateAccommodationImage(
          imageData,
          
        );
        if (response.success) {
          message.success("Image uploaded successfully!");
        } else {
          message.error("Failed to upload image.");
        }
      }
    } catch (error) {
      console.error("Error creating accommodation:", error);
      message.error("Failed to create accommodation. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 max-w-4xl mx-auto ">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Create Accommodation
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-white border border-gray-300 rounded-lg shadow-md"
      >
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          <Input
            label="Name"
            {...register("name")}
            className="input input-bordered w-full"
            error={errors.name?.message}
          />

          <Textarea
            label="Description"
            {...register("description")}
            className="textarea textarea-bordered w-full"
            error={errors.description?.message}
          />

          <Input
            label="Location"
            {...register("location")}
            className="input input-bordered w-full"
            error={errors.location?.message}
          />

          <Input
            label="Address"
            {...register("address")}
            className="input input-bordered w-full"
            error={errors.address?.message}
          />

          <Input
            label="Latitude"
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
            className="input input-bordered w-full"
            error={errors.latitude?.message}
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
            className="input input-bordered w-full"
            error={errors.longitude?.message}
          />

          <Input
            label="Category (ex: Apartment,Hotel, Hostel, etc.)"
            {...register("category")}
            className="input input-bordered w-full"
            error={errors.category?.message}
          />

          <Input
            label="Tags (ex: luxury,city-center etc.)"
            {...register("tags")}
            className="input input-bordered w-full"
          />

          <Input
            label="Check-in Time"
            type="time"
            {...register("check_in_time")}
            onFocus={(e) => e.target.showPicker?.()}
            className="input input-bordered w-full"
            error={errors.check_in_time?.message}
          />

          <Input
            label="Check-out Time"
            type="time"
            {...register("check_out_time")}
            onFocus={(e) => e.target.showPicker?.()}
            className="input input-bordered w-full"
            error={errors.check_out_time?.message}
          />

          <div className=" grid grid-cols-1  gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("smoking_allowed")}
                className="checkbox"
              />
              <label>Smoking Allowed</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("pets_allowed")}
                className="checkbox"
              />
              <label>Pets Allowed</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("is_active")}
                className="checkbox"
              />
              <label>Active</label>
            </div>
          </div>

          <Textarea
            label="Additional Rules"
            {...register("additional_rules")}
            className="textarea textarea-bordered w-full lg:col-span-2"
          />
        </div>

        <div className="grid grid-cols-1  gap-4 border-t-2 pt-4 w-full">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Facilities
              </label>
              <span
                onClick={() => setActiveModalId(`facility-list`)}
                className=" bg-primaryGreen text-white p-2 text-sm rounded cursor-pointer hover:bg-primaryGreen/80 transition-colors"
                title="Add Facilities"
              >
                {" "}
                + Facilities
              </span>
            </div>

            {selectedFacilities.length > 0 ? (
              <div className="text-gray-500 min-h-10 rounded-md p-4 border w-full max-h-48 overflow-y-scroll hide-scrollbar bg-gray-50">
                {selectedFacilities?.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b py-2"
                  >
                    <span className="text-gray-700">{facility.name}</span>
                    <span
                      onClick={() =>
                        setSelectedFacilities((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 min-h-20 rounded-md p-4 border w-full italic">
                No facility selected
              </p>
            )}
          </div>

          {/* create image section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Image
            </label>
            <input
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImage(file);
                  setValue("image", file);
                }
              }}
              name="image"
              id="image"
              placeholder="Upload Image"
              type="file"
              accept="image/*"
              className="input input-bordered w-full"
            />
            <p className="text-gray-500 text-sm mt-1">
              Upload an image for the accommodation (optional).
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`bg-primaryGreen text-white px-4 py-2 rounded-md transition-colors w-full ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primaryGreen/80"
            }`}
          >
            {loading ? "Submitting..." : "Create Accommodation"}
          </button>
        </div>
      </form>
      <CenterModal
        children={
          <CreateFacilities
            setFacilities={(selected) => setSelectedFacilities(selected)}
          />
        }
        id={`facility-list`}
      />
    </div>
  );
};

export default AccommodationForm;

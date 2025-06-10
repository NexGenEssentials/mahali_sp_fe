"use client";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { Input, Textarea } from "@/app/components/form/inputField";
import {
  CreateRoomImage,
  CreateRoomTypeAPI,
} from "@/app/api/accommodation/action";
import message from "antd/es/message";
import { useRouter } from "next/navigation";

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price_per_night: z.number().min(0, "Price must be positive"),
  max_guests: z.number().min(1, "Maximum guests must be at least 1"),
  max_children: z.number().min(0, "Maximum children cannot be negative"),
  max_beds: z.number().min(1, "Maximum beds must be at least 1"),
  total_units: z.number().min(1, "Maximum beds must be at least 1"),
  bed_type: z.string().min(1, "Bed type is required"),
  size: z.number().min(1, "Room size must be positive"),
  includes: z.string().optional(),
  image: z.instanceof(File).nullable().optional(),
  is_available: z.boolean(),
});

export type RoomFormData = z.infer<typeof roomSchema>;

interface CreateRoomTypeProps {
  params: { id: number };
}

const CreateRoomType: React.FC<CreateRoomTypeProps> = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),

    defaultValues: {
      name: "",
      description: "",
      price_per_night: 0,
      max_guests: 1,
      max_children: 0,
      max_beds: 1,
      bed_type: "",
      size: 0,
      total_units: 1,
      includes: "",
      image: null,
      is_available: true,
    },
  });

  const bedTypes = [
    "Single Bed",
    "Twin Beds",
    "Double Bed",
    "Queen Bed",
    "King Bed",
    "Sofa Bed",
    "Bunk Bed",
  ];

  const onSubmit = async (data: RoomFormData) => {
    setLoading(true);
    try {
      const roomData = {
        ...data,
        accommodation: params.id,
        image: null,
      };

      const result = await CreateRoomTypeAPI(roomData);

      if (result.success) {
        reset();
        message.success("Room created successfully!");

        const formData = new FormData();
        formData.append("room_type", result.data.id.toString());
        if (image) {
          formData.append("image", image);
        }

        const response = await CreateRoomImage(formData);
        if (response.success) {
          message.success("Room image uploaded successfully!");
          setImage(null);
          setImagePreview(null);
          router.push(`/dashboard/service/accommodation/${params.id}`);
        } else {
          message.error("Room created, but image upload failed.");
        }
      } else {
        message.error("Failed to create room. Please try again.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      message.error("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setValue("image", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ServiceProviderTemplate>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Add New Room Type
            </h1>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8 space-y-4">
              {/* Basic Information */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Room Name"
                  {...register("name")}
                  error={errors.name?.message}
                  placeholder="Room name"
                  required
                />

                <Textarea
                  label="Description"
                  {...register("description")}
                  error={errors.description?.message}
                  placeholder="Describe the room "
                  required
                />
              </div>

              {/* Pricing & Capacity */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Input
                    label="Price per Night"
                    type="number"
                    step="0.01"
                    {...register("price_per_night", { valueAsNumber: true })}
                    error={errors.price_per_night?.message}
                    placeholder="0.00"
                    required
                  />

                  <Input
                    label="Max Guests"
                    type="number"
                    {...register("max_guests", { valueAsNumber: true })}
                    error={errors.max_guests?.message}
                    placeholder="2"
                    required
                  />

                  <Input
                    label="Max Children"
                    type="number"
                    {...register("max_children", { valueAsNumber: true })}
                    error={errors.max_children?.message}
                    placeholder="1"
                  />

                  <Input
                    label="Max Beds"
                    type="number"
                    {...register("max_beds", { valueAsNumber: true })}
                    error={errors.max_beds?.message}
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              {/* Room Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Bed Type <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      {...register("bed_type")}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.bed_type
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select bed type</option>
                      {bedTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.bed_type && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.bed_type.message}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Room Size (sq ft)"
                    type="number"
                    step="0.1"
                    {...register("size", { valueAsNumber: true })}
                    error={errors.size?.message}
                    placeholder="36.5"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="total Units"
                    type="number"
                    {...register("total_units", { valueAsNumber: true })}
                    error={errors.total_units?.message}
                    placeholder="1"
                    required
                  />
                  <Input
                    label="Includes"
                    {...register("includes")}
                    error={errors.includes?.message}
                    placeholder="e.g., Wi-Fi, Breakfast, Air Conditioning"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Room Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Room preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Availability
                  </h3>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("is_available")}
                    className="ant-checkbox ant-checkbox-checked ant-checkbox-inner w-4 h-4 text-primaryGreen bg-gray-100 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Room is available for booking
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-1/2 mx-auto flex items-center justify-center px-8 py-3 text-base font-semibold text-white rounded-lg transition-all duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primaryGreen transform hover:scale-105 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Room...
                    </>
                  ) : (
                    <>Create Room</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ServiceProviderTemplate>
  );
};

export default CreateRoomType;

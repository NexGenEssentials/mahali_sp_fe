"use client";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDropzone } from "react-dropzone";
import { X, ImagePlus, Images } from "lucide-react";
import { Input, Textarea } from "@/app/components/form/inputField";
import {
  CreateRoomImage,
  EditRoomTypeAPI,
  getRoomTypeAPI,
} from "@/app/api/accommodation/action";
import message from "antd/es/message";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/skeleton/loader";

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

const EditRoomType = ({
  params,
}: {
  params: { id: number; roomid: number };
}) => {
  const { id, roomid } = params;
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...acceptedFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
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
    try {
      const roomData = {
        ...data,
        accommodation: id,
        image: null,
      };

      const result = await EditRoomTypeAPI(roomid, roomData);

      if (result.success) {
        reset();
        message.success("Room Updated successfully!");

        const formData = new FormData();
        formData.append("room_type", roomid.toString());
        images.forEach((img) => {
          formData.append("image", img);
        });

        const response = await CreateRoomImage(formData);
        if (response.success && Images.length > 0) {
          message.success("Room image uploaded successfully!");
        }
      } else {
        message.error("Failed to create room. Please try again.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      message.error("Failed to create room. Please try again.");
    } finally {
      router.push(`/dashboard/service/accommodation/${id}`);
      setImages([]);
      setImagePreviews([]);
      reset();
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        const response = await getRoomTypeAPI(roomid);
        

        if (response.success) {
          reset({
            name: response.data.name || "",
            description: response.data.description || "",
            price_per_night: Number(response.data.price_per_night) || 0,
            max_guests: response.data.max_guests || 1,
            max_children: response.data.max_children ?? 0,
            max_beds: response.data.max_beds || 1,
            total_units: response.data.total_units || 1,
            bed_type: response.data.bed_type || "",
            size: Number(response.data.size) || 0,
            includes: response.data.includes || "",
            is_available: response.data.is_available ?? true,
          });
          setImagePreviews(response.data.images || []);
        } else {
          message.warning("something went wrong");
        }
      } catch (error) {
        console.error("Error fetching accommodation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <ServiceProviderTemplate>
      <div className="bg-gray-100 p-6 max-w-4xl mx-auto ">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Room Type
        </h1>

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
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Add More Room Images
              </h3>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "hover:border-primaryGreen"
                }`}
              >
                <input {...getInputProps()} />
                <ImagePlus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag & drop or click to upload (multiple images)
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="relative group aspect-video rounded overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                disabled={isSubmitting}
                className={`w-1/2 mx-auto flex items-center justify-center px-8 py-3 text-base font-semibold text-white rounded-lg transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primaryGreen transform hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Editing Room...
                  </>
                ) : (
                  <>Edit Room</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ServiceProviderTemplate>
  );
};

export default EditRoomType;

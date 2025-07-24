"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "../../form/inputField";
import { useAppContext } from "@/app/context";
import { ImagePlus, X } from "lucide-react";
import CenterModal from "../../model/centerModel";
import CreateFacilities from "./facility";
import message from "antd/es/message";
import {
  CreateAccommodationImage,
  EditAccomodation,
  getAccommodation,
} from "@/app/api/accommodation/action";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Loader from "../../skeleton/loader";

const accommSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
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
  image: z.instanceof(File).nullable().optional(),
});

export type AccommFormData = z.infer<typeof accommSchema>;

const EditAccommodationForm = ({ id }: { id: number }) => {
  const { setActiveModalId } = useAppContext();
  const router = useRouter();
  const [selectedFacilities, setSelectedFacilities] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AccommFormData>({
    resolver: zodResolver(accommSchema),
    defaultValues: {
      facility_ids: [],
      is_active: true,
      is_featured: false,
      rating: 0,
      smoking_allowed: false,
      pets_allowed: false,
      image: null,
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const normalizeTime = (timeStr: string) => timeStr.slice(0, 5);

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

  const onSubmit = async (data: AccommFormData) => {
    try {
      const facilityIds = selectedFacilities.map((f) => f.id);

      const formData: AccommFormData = {
        ...data,
        image: null,
        facility_ids: facilityIds,
      };

      const result = await EditAccomodation(id, formData);

      if (!result) {
        message.error("Failed to create accommodation. Please try again.");
        return;
      }
      if (result.success && images.length > 0) {
        message.success("Accommodation updated successfully!");

        const formData = new FormData();
        formData.append("accommodation", id.toString());
        images.forEach((img) => {
          formData.append("image", img);
        });
        const response = await CreateAccommodationImage(formData);
        if (response.success) {
          message.success("Image uploaded successfully!");
        } else {
          message.error("Failed to upload image.");
        }
      }
    } catch (error) {
      console.error("Error creating accommodation:", error);
      message.error("Failed to create accommodation. Please try again.");
    } finally {
      setImages([]);
      setImagePreviews([]);
      router.push("/dashboard/service");
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
        const response = await getAccommodation(id);

        if (response.success) {
          reset({
            name: response.data.name,
            description: response.data.description,
            location: response.data.location,
            address: response.data.address,
            latitude: Number(response.data.latitude),
            longitude: Number(response.data.longitude),
            category: response.data.category,
            rating: Number(response.data.rating),
            facility_ids: response.data.facilities.map((f) => f.id),
            tags: response.data.tags || "",
            check_in_time: normalizeTime(response.data.check_in_time),
            check_out_time: normalizeTime(response.data.check_out_time),
            smoking_allowed: response.data.smoking_allowed,
            pets_allowed: response.data.pets_allowed,
            additional_rules: response.data.additional_rules || "",
            is_active: response.data.is_active,
            is_featured: response.data.is_featured,
          });
          setSelectedFacilities(response.data.facilities || []);
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
    <div className="bg-gray-100 p-6 max-w-4xl mx-auto ">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Edit Accommodation
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
              <label className="block font-bold text-sm text-gray-700 mb-2">
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

          {/* Image Upload */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Add more accommodation Images
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
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-primaryGreen text-white px-4 py-2 rounded-md transition-colors w-full ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primaryGreen/80"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Edit Accommodation"}
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

export default EditAccommodationForm;

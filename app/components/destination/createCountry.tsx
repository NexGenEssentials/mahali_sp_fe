"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCountry } from "@/app/api/destinations/action";
import message from "antd/es/message";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { Input, Textarea } from "../form/inputField";
import { SeasonType } from "@/app/types/destination";

const seasonSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description should be at least 5 characters"),
  season: z.string().min(2, "Season is required"),
  start_month: z.string().min(2, "Start month is required"),
  end_month: z.string().min(2, "End month is required"),
  season_description: z.string().min(5, "Season description is required"),
});

export type CountryFormData = z.infer<typeof seasonSchema>;

const CreateDestinationPage = () => {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<SeasonType[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CountryFormData>({
    resolver: zodResolver(seasonSchema),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...acceptedFiles]);
      setImagePreviews((prev) => [...prev, ...previews]);
    },
  });

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleAddSeason = () => {
    const seasonData = {
      country: 0, 
      season: getValues("season"),
      start_month: getValues("start_month"),
      end_month: getValues("end_month"),
      description: getValues("season_description"),
    };

    const seasonValidation = z.object({
      season: z.string().min(2),
      start_month: z.string().min(2),
      end_month: z.string().min(2),
      description: z.string().min(5),
    });

    const parsed = seasonValidation.safeParse(seasonData);

    if (!parsed.success) {
      message.error("Please complete the season fields correctly.");
      return;
    }

    setSeasons((prev) => [...prev, seasonData]);
    // Clear only season fields
    setValue("season", "");
    setValue("start_month", "");
    setValue("end_month", "");
    setValue("season_description", "");
  };

  const onSubmit = async (data: CountryFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    images.forEach((img) => {
      formData.append("image", img);
    });
    formData.append("seasons", JSON.stringify(seasons));

    try {
      const response = await CreateCountry(formData);
      if (response.success) {
        message.success("Country created successfully");
        reset();
        setSeasons([]);
        router.push("/dashboard/destinations");
      } else {
        message.error(
          `Failed to create a Country. Please try again. ${response.detail}`
        );
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">Create Country</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-lg"
      >
        {/* Basic Info */}
        <div>
          <Input
            label="Country Name"
            {...register("name")}
            error={errors.name?.message}
          />
          <Textarea
            label="Description"
            {...register("description")}
            error={errors.description?.message}
          />
        </div>

        {/* Season Section */}
        <div className="space-y-5">
          <h1 className="font-bold">Add Seasons</h1>
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Season"
                {...register("season")}
                error={errors.season?.message}
              />
              <Textarea
                label="Season Description"
                {...register("season_description")}
                error={errors.season_description?.message}
              />
              <Input
                label="Season Start Month"
                {...register("start_month")}
                error={errors.start_month?.message}
              />
              <Input
                label="Season End Month"
                {...register("end_month")}
                error={errors.end_month?.message}
              />
            </div>

            <button
              onClick={handleAddSeason}
              type="button"
              className="px-4 py-2 bg-primaryGreen text-white rounded-full hover:bg-primaryGreen/70"
            >
              Add Season
            </button>
          </div>

          {seasons.length > 0 && (
            <div className="mt-6 ">
              <h3 className="text-lg font-semibold">Seasons List</h3>
              <div className="max-h-64 bg-gray-100 overflow-y-auto mt-2 space-y-3 p-2">
                {seasons.map((plan, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-md bg-white shadow-sm"
                  >
                    <h4 className="font-semibold">{plan.season}</h4>
                    <p>
                      <strong>Season Description:</strong> {plan.description}
                    </p>
                    <p>
                      <strong>Start Month:</strong> {plan.start_month}
                    </p>
                    <p>
                      <strong>End Month:</strong> {plan.end_month}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Country Images</h3>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primaryGreen/80 text-white py-2 px-4 rounded hover:bg-primaryGreen disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Country"}
        </button>
      </form>
    </div>
  );
};

export default CreateDestinationPage;

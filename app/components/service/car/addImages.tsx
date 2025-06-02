"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { message } from "antd";
import { CreateCarFeatures, CreateCarImages } from "@/app/api/carRental/action";
import CenterModal from "../../model/centerModel";
import CarFeatures from "./carFeatures";
import { useAppContext } from "@/app/context";
import { useRouter } from "next/navigation";

export function CarImages({ carId }: { carId: number }) {
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [features, setFeatures] = useState<{ id: number; name: string }[]>([]);
  const { setActiveModalId } = useAppContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

  const handleUpload = async () => {
    if (imageFile.length === 0) {
      message.warning("Please select at least one image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    imageFile.forEach((image, index) => {
      formData.append("image", image);
    });

    const featuresIds = features.map((feature) => feature.id);
    try {
      if (featuresIds.length > 0) {
        const result = await CreateCarFeatures(featuresIds, carId);
        if (!result.success) {
          message.error("Failed to upload features");
        } else {
          message.success("Features uploaded successfully");
          setFeatures([]);
        }
      }
      // Upload image
      const response = await CreateCarImages(formData, carId);

      if (!response.success) {
        message.error("Failed to upload image");
      } else {
        message.success("Image uploaded successfully");

        router.push("/dashboard/service/car");
      }
    } catch (error) {
      message.error("Error uploading data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-6">
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
          Drag & drop or click to upload (1 image only)
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
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Features Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b pb-1">
          <h3 className="text-lg font-semibold">Features</h3>
          <button
            onClick={() => setActiveModalId(`Car-features-list`)}
            type="button"
            className="text-primaryGreen hover:bg-primaryGreen hover:text-white font-bold duration-300 border border-primaryGreen rounded-md px-2 py-1"
          >
            + Add Features
          </button>
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

      <div className="flex items-center justify-center w-full">
        <button
          onClick={handleUpload}
          disabled={!imageFile || loading}
          type="button"
          className="text-primaryGreen hover:bg-primaryGreen hover:text-white font-bold duration-300 border border-primaryGreen rounded-full p-4 w-52"
        >
          {loading ? "Uploading..." : "+ Upload Data"}
        </button>
      </div>

      <CenterModal
        children={
          <CarFeatures setFeatures={(selected) => setFeatures(selected)} />
        }
        id={`Car-features-list`}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { message } from "antd";
import { CreateTourImages } from "@/app/api/tour/action";
import { useRouter } from "next/navigation";

type AddTourImagesProps = {
  tourId: number;
};

const AddTourImages = ({ tourId }: AddTourImagesProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...acceptedFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
  });

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      message.warning("Please select at least one image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("image", image);
      });

      const response = await CreateTourImages(formData, tourId);
      if (!response.success) throw new Error("Upload failed");
      else {
        message.success("Images uploaded successfully");
        setImages([]);
        setPreviews([]);
        router.push("/service");
      }
    } catch (error) {
      message.error("Error uploading images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <h3 className="text-lg font-semibold border-b pb-1">
        Upload Tour Images
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
          Drag & drop or click to upload images
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative group aspect-video rounded overflow-hidden"
            >
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-primaryGreen text-white rounded hover:bg-primaryGreen/70 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
};

export default AddTourImages;

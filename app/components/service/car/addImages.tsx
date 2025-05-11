"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";

export function CarImages({ carId }: { carId: number }) {
  const [images, setImages] = useState<string[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 5,
    onDrop: (files) => {
      const urls = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...urls]);
    },
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-6">
      <h3 className="text-lg font-semibold border-b pb-1 ">Car Images</h3>
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
          Drag & drop or click to upload (max 5 images)
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, index) => (
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
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b pb-1">
          <h3 className="text-lg font-semibold ">Features</h3>
          <button
            type="button"
            className="text-primaryGreen hover:bg-primaryGreen hover:text-white font-bold duration-300 border border-primaryGreen rounded-md px-2 py-1"
          >
            + Add Features
          </button>
        </div>
        <p className="text-gray-500 min-h-20 rounded-md p-4 border w-full italic">
          No features selected
        </p>
      </div>
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          className="text-primaryGreen hover:bg-primaryGreen hover:text-white font-bold duration-300 border border-primaryGreen rounded-full p-4 w-52 "
        >
          + upload Data
        </button>
      </div>
    </div>
  );
}

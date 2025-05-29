"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea } from "../../form/inputField";
import { facility, getFacilities } from "@/app/api/accommodation/action";
import { message } from "antd";

const accommSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(0).max(5),
  facility_id: z.array(z.number()).optional(),
  tags: z.string().optional(),
  check_in_time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format (HH:MM:SS)"),
  check_out_time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format (HH:MM:SS)"),
  smoking_allowed: z.boolean(),
  pets_allowed: z.boolean(),
  additional_rules: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

type AccommFormData = z.infer<typeof accommSchema>;

const AccommodationForm: React.FC = () => {
  const [facilities, setFacility] = React.useState<facility[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AccommFormData>({
    resolver: zodResolver(accommSchema),
    defaultValues: {
      facility_id: [],
      is_active: true,
      is_featured: false,
      rating: 0,
    },
  });

  const onSubmit = (data: AccommFormData) => {
    console.log("Form Submitted", data);
  };

  React.useEffect(() => {
    handleGetFacility();
  }, []);

  const handleGetFacility = async () => {
    try {
      const result = await getFacilities();

      if (result.success) {
        setFacility(result.data);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="bg-gray-100 p-6 max-w-4xl mx-auto ">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Create Accommodation
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white border border-gray-300 rounded-lg shadow-md"
      >
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
          label="Category"
          {...register("category")}
          className="input input-bordered w-full"
          error={errors.category?.message}
        />

        <Input
          label="Rating"
          type="number"
          step="0.1"
          max={5}
          min={0}
          {...register("rating", { valueAsNumber: true })}
          className="input input-bordered w-full"
          error={errors.rating?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facilities
          </label>
          <select
           
            className="input input-bordered w-full"
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions);
              const ids = selectedOptions.map((option) => Number(option.value));
              setValue("facility_id", ids);
            }}
          >
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          {errors.facility_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.facility_id.message}
            </p>
          )}
          <div>
            {}
          </div>
        </div>

        <Input
          label="Tags"
          {...register("tags")}
          className="input input-bordered w-full"
        />

        <Input
          label="Check-in Time"
          type="time"
          {...register("check_in_time")}
          className="input input-bordered w-full"
          error={errors.check_in_time?.message}
        />

        <Input
          label="Check-out Time"
          type="time"
          {...register("check_out_time")}
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

        <div className="lg:col-span-2">
          <button
            type="submit"
            className=" bg-primaryGreen text-white px-4 py-2 rounded-md hover:bg-primaryGreen/80 transition-colors w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccommodationForm;

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { message } from "antd";
import { Input, Textarea } from "../../form/inputField";
import { CountryType } from "@/app/types/service/tour";
import { CreateTourPackage, getAllCountry } from "@/app/api/tour/action";
import AddTourPlans from "./addTourPlan";
import { motion } from "framer-motion";
import AddTourImages from "./addTourImages";

const tourFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  best_time_to_visit: z.string().min(1),
  duration_days: z.coerce.number().min(1),
  duration_nights: z.coerce.number().min(1),
  min_people: z.coerce.number().min(1),
  max_people: z.coerce.number().min(1),
  country_id: z.coerce.number().min(1),
});

export type TourFormSchema = z.infer<typeof tourFormSchema>;

export default function TourForm() {
  const [country, setCountry] = useState<CountryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [id, setId] = useState<number>(0);
  const [data, setData] = useState<TourFormSchema>({
    title: "",
    description: "",
    location: "",
    best_time_to_visit: "",
    duration_days: 1,
    duration_nights: 1,
    min_people: 1,
    max_people: 1,
    country_id: 1,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TourFormSchema>({
    resolver: zodResolver(tourFormSchema),
  });

  const onSubmit = async (data: TourFormSchema) => {
    setData(data)
    setStep(2)
  };

  useEffect(() => {
    handleGetCountry();
  }, []);

  const handleGetCountry = async () => {
    try {
      const result = await getAllCountry();

      if (result.success) {
        setCountry(result.data);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <>
      {step === 1 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
        >
          <h2 className="text-2xl font-bold">Create Tour</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              {...register("title")}
              placeholder="Tour Title"
              error={errors.title?.message}
            />
            <Input
              label="Location"
              {...register("location")}
              placeholder="Tour Location"
              error={errors.location?.message}
            />
            <Input
              label="Best Time to Visit"
              placeholder="June to September"
              {...register("best_time_to_visit")}
              error={errors.best_time_to_visit?.message}
            />
            <Input
              type="number"
              label="Duration Days"
              min={1}
              placeholder="Number of days for the tour"
              {...register("duration_days")}
              error={errors.duration_days?.message}
            />
            <Input
              type="number"
              label="Duration Nights"
              min={1}
              placeholder="Number of nights for the tour"
              {...register("duration_nights")}
              error={errors.duration_nights?.message}
            />
            <Input
              type="number"
              label="Min People"
              min={1}
              placeholder="Minimum number of people"
              {...register("min_people")}
              error={errors.min_people?.message}
            />
            <Input
              type="number"
              label="Max People"
              min={1}
              placeholder="Maximum number of people"
              {...register("max_people")}
              error={errors.max_people?.message}
            />

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
              <select
                id="country"
                {...register("country_id", { valueAsNumber: true })}
                className="input pt-4 w-full"
              >
                <option value="" disabled>
                  Select Tour Country
                </option>
                {country.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              {errors.country_id && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country_id.message}
                </p>
              )}
            </div>
          </div>

          <Textarea
            label="Description"
            {...register("description")}
            placeholder="Tour Description"
            error={errors.description?.message}
          />

          <div className="w-full flex items-center justify-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={isSubmitting}
              className="mt-4 px-4 py-2 rounded-full bg-primaryGreen text-white w-3/4 hover:bg-primaryGreen/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? "Submitting..." : "Next"}
            </motion.button>
          </div>
        </form>
      )}

      {step === 2 && (
        <AddTourPlans data={data} setStep={setStep} setId={setId} />
      )}

      {step === 3 && <AddTourImages tourId={id} />}
    </>
  );
}

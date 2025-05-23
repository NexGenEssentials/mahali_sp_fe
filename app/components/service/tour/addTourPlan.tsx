"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { message } from "antd";
import { Input, Textarea } from "../../form/inputField";
import { motion } from "framer-motion";
import { CreateTourPackage } from "@/app/api/tour/action";
import { TourFormSchema } from "./createTourForm";

const tourPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  inclusion: z.string().min(1, "Inclusion is required"),
  accommodation: z.string().min(1, "Accommodation is required"),
});

type TourPlan = z.infer<typeof tourPlanSchema>;

export default function AddTourPlans({
  data,
  setStep,
  setId,
}: {
  data: TourFormSchema;
  setStep: (value: number) => void;
  setId: (value: number) => void;
}) {
  const [tourPlans, setTourPlans] = useState<TourPlan[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TourPlan>({
    resolver: zodResolver(tourPlanSchema),
    defaultValues: {
      title: "",
      description: "",
      inclusion: "",
      accommodation: "",
    },
  });

  const handleAddPlan = (data: TourPlan) => {
    setTourPlans((prev) => [...prev, data]);
    reset();
  };

  const handleFinalSubmit = async () => {
    if (tourPlans.length === 0) {
      message.warning("Please add at least one tour plan.");
      return;
    }

    try {
      const result = await CreateTourPackage({
        ...data,
        tour_plans: tourPlans,
      });

      if (result.success) {
        setId(result.data.id);
        message.success("Tour submitted successfully!");
        setTourPlans([]);
        setStep(3);
      }
    } catch (err) {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-bold">Create Tour Plans</h2>

      <form
        onSubmit={handleSubmit(handleAddPlan)}
        className="space-y-4  p-4 border rounded-md bg-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Title"
            {...register("title")}
            error={errors.title?.message}
          />

          <Input
            label="Inclusion"
            {...register("inclusion")}
            error={errors.inclusion?.message}
          />
          <Input
            label="Accommodation"
            {...register("accommodation")}
            error={errors.accommodation?.message}
          />
        </div>
        <Textarea
          label="Description"
          {...register("description")}
          error={errors.description?.message}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primaryGreen text-white rounded-full hover:bg-primaryGreen/70"
        >
          Add Plan
        </button>
      </form>

      {tourPlans.length > 0 && (
        <div className="mt-6 ">
          <h3 className="text-lg font-semibold">Tour Plan List</h3>
          <div className="max-h-64 bg-gray-100 overflow-y-auto mt-2 space-y-3 p-2">
            {tourPlans.map((plan, index) => (
              <div
                key={index}
                className="border p-4 rounded-md bg-white shadow-sm"
              >
                <h4 className="font-semibold">{plan.title}</h4>
                <p>
                  <strong>Description:</strong> {plan.description}
                </p>
                <p>
                  <strong>Inclusion:</strong> {plan.inclusion}
                </p>
                <p>
                  <strong>Accommodation:</strong> {plan.accommodation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-end">
        {/* <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 rounded-full bg-primaryGreen text-white w-fit hover:bg-primaryGreen/70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Back"}
        </motion.button> */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 rounded-full bg-primaryGreen text-white w-fit hover:bg-primaryGreen/70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </motion.button>
      </div>
    </div>
  );
}

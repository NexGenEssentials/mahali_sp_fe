"use client";
import React, { useEffect, useState } from "react";
import { TourPlan, tourPlanSchema } from "./addTourPlan";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import message from "antd/es/message";
import { Input, Textarea } from "../../form/inputField";
import { motion } from "framer-motion";
import { CreateTourPlans, getTourPlans } from "@/app/api/tour/action";
import { TourPlanType } from "@/app/types/service/tour";
import Loader from "../../skeleton/loader";
import { pre } from "framer-motion/client";

const EditTourPlan = ({ id }: { id: number }) => {
  const [tourPlans, setTourPlans] = useState<TourPlanType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const fetchTourPlans = async () => {
      try {
        const data = await getTourPlans(id);

        if (data) {
          if ('title' in data && 'description' in data && 'inclusion' in data && 'accommodation' in data) {
            setTourPlans(prev => [...prev, data as TourPlanType]);
          } else {
            console.error("Invalid data format:", data);
            message.error("Failed to load tour plans due to invalid data format.");
          }
          setLoading(false);
        } else {
          message.error("Failed to load tour plans.");
        }
      } catch (error) {
        console.error(error);
        message.error("Something went wrong while fetching tour plans.");
      }
    };

    fetchTourPlans();
  }, []);

  const handleAddPlan = (data: TourPlan) => {
    setTourPlans((prev) => [...prev, data]);
    reset();
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    if (tourPlans.length === 0) {
      message.warning("Please add at least one tour plan.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await CreateTourPlans(tourPlans, id);
      if (result.success) {
        message.success("Tour Plan Added Successfully!");
      }
    } catch (err) {
      message.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] min-w-60">
        <Loader />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-bold">Edit Plans</h2>

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
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 rounded-full bg-primaryGreen text-white w-fit hover:bg-primaryGreen/70 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save & Continue"}
        </motion.button>
      </div>
    </div>
  );
};

export default EditTourPlan;

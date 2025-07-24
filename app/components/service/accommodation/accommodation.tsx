"use client";
import { SquarePen } from "lucide-react";
import React, { useEffect, useState } from "react";
import AccommodationTable from "./accomTable";
import {
  DeleteAccommodation,
  getAllAccomodations,
} from "@/app/api/accommodation/action";
import { AccommodationType } from "@/app/types/service/accommodation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import message from "antd/es/message";

const AdminAccommodationTable = () => {
  const [loading, setLoading] = useState(true);
  const [accomList, setAccomList] = useState<AccommodationType[]>([]);
  const router = useRouter();

  useEffect(() => {
    getAllAccommodations();
  }, []);

  const getAllAccommodations = async () => {
    setLoading(true);
    try {
      const result = await getAllAccomodations();
      if (result.success) setAccomList(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const result = await DeleteAccommodation(id);
      if (result) {
        message.success("Accommodation deleted successfully");
        setAccomList((prev) => prev.filter((accomId) => accomId.id !== id));
      }
    } catch (error) {
      console.error("Error deleting Accommodation:", error);
      message.error("Failed to delete Accommodation. Please try again later.");
    }
  };

  const handleUpdate = (id: number) => {
   router.push(`/dashboard/service/accommodation/edit/${id}`);
  };

  const handleView = (id: number, category: string) => {
    router.push(`/dashboard/service/accommodation/${id}`);
  };

  return (
    <div className=" bg-gray-100 p-6">
      <div className="w-full mx-auto">
        <div className="flex justify-between gap-4 w-full px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 ">
            All Accommodations
          </h1>
          <motion.span
            onClick={() => router.push("/dashboard/service/accommodation")}
            whileHover={{ scale: 0.9 }}
            className="p-3 rounded-md text-white hover:bg-primaryGreen bg-primaryGreen/70 cursor-pointer font-bold flex gap-2"
          >
            Create New Accommodation <SquarePen />
          </motion.span>
        </div>
        <AccommodationTable
          accom={accomList}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onView={handleView}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminAccommodationTable;

"use client";
import { SquarePen } from "lucide-react";
import React, { useEffect, useState } from "react";
import AccommodationTable from "./accomTable";
import { getAllAccomodations } from "@/app/api/accommodation/action";
import { AccommodationType } from "@/app/types/service/accommodation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
  const handleDelete = (id: number) => {
    console.log("Delete tour package with id:", id);
  };

  const handleUpdate = (id: number) => {
    console.log("Update tour package:", id);
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

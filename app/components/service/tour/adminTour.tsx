"use client";
import React, { useEffect, useState } from "react";
import TourPackagesTable from "./tourPackagestable";
import { SquarePen } from "lucide-react";

import { getAllTours } from "@/app/api/tour/action";

import { useRouter } from "next/navigation";
import { TourDataType } from "@/app/types/service/tour";
import { motion } from "framer-motion";

function AdminTourServiceApp() {
  const [loading, setLoading] = useState(true);
  const [packageList, setPackageList] = useState<TourDataType>({});
  const router = useRouter();

  useEffect(() => {
    getAllTourPackages();
  }, []);

  const getAllTourPackages = async () => {
    setLoading(true);
    try {
      const result = await getAllTours();
      if (result.success) setPackageList(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (id: number) => {
    console.log("Delete tour package with id:", id);
  };

  const handleUpdate = (tourPackage: number) => {
    console.log("Update tour package:", tourPackage);
  };

  const handleView = (tourPackage: number) => {
    router.push(`/packages/${tourPackage}`);
  };

  return (
    <div className=" bg-gray-100 p-6">
      <div className="w-full mx-auto">
        <div className="flex justify-between gap-4 w-full px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 ">Tour Packages</h1>
          <motion.span
            whileHover={{ scale: 0.9 }}
            className="p-3 rounded-md text-white hover:bg-primaryGreen bg-primaryGreen/70 cursor-pointer font-bold flex gap-2"
          >
            Create New Tour <SquarePen />
          </motion.span>
        </div>
        <TourPackagesTable
          tour={packageList}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onView={handleView}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default AdminTourServiceApp;

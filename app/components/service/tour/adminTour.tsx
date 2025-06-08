"use client";
import React, { useEffect, useState } from "react";
import TourPackagesTable from "./tourPackagestable";
import { SquarePen } from "lucide-react";

import { DeleteTourPackage, getAllTours } from "@/app/api/tour/action";

import { useRouter } from "next/navigation";
import { TourDataType } from "@/app/types/service/tour";
import { motion } from "framer-motion";
import Link from "next/link";
import message from "antd/es/message";

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

const handleDelete = async (id: number) => {
  const result = await DeleteTourPackage(id);

  if (result) {
    message.success("Tour Package deleted successfully");

    setPackageList((prev) => {
      if (!prev) return prev;

      const updatedData: TourDataType = {};

      for (const country in prev) {
        const countryTours = prev[country];
        updatedData[country] = countryTours.filter((tour) => tour.id !== id);
      }

      return updatedData;
    });
  }
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
          <Link href="/dashboard/service/tour">
            <motion.span
              whileHover={{ scale: 0.9 }}
              className="p-3 rounded-md text-white hover:bg-primaryGreen bg-primaryGreen/70 cursor-pointer font-bold flex gap-2"
            >
              Create New Tour <SquarePen />
            </motion.span>
          </Link>
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

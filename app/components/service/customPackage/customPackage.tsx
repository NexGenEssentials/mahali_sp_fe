"use client";
import { DeleteCustomPackage, getCustomPackage } from "@/app/api/tour/action";
import { CustomPackageData } from "@/app/types/service/tour";
import { motion } from "framer-motion";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Title from "../../header/title";
import { useAppContext } from "@/app/context";
import CustomPackageCard from "../../card/custompackageCard";

const CustomPackage = () => {
  const [custPack, setCustPack] = useState<CustomPackageData[]>([]);
  const [filteredCustomPack, setFilteredCustomPack] = useState<
    CustomPackageData[]
  >([]);
  const [loading, setloading] = useState(false);
  const { setActiveModalId } = useAppContext();

  useEffect(() => {
    getCustomData();
  }, []);

  const getCustomData = async () => {
    setloading(true);
    const result = await getCustomPackage();
    if (result.success) {
      setCustPack(result.data);
      setFilteredCustomPack(result.data);
      setloading(false);
    }
  };

  const handleApprove = async (packageId: number) => {
    try {
      // const result = await DeleteCustomPackage(packageId);
      // if (true)
      //   setFilteredCustomPack((prev) =>
      //     prev.filter((booking) => booking.id !== packageId)
      //   );
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };

  const handleDelete = async (packageId: number) => {
    try {
      const result = await DeleteCustomPackage(packageId);
      if (result)
        setFilteredCustomPack((prev) =>
          prev.filter((booking) => booking.id !== packageId)
        );
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };
  return (
    <div className=" bg-gray-100 p-6">
      <div className="w-full mx-auto">
        <div className="flex justify-between gap-4 w-full px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 ">
            Custom Tour Packages
          </h1>
          <Link href="/dashboard/service/customer-package">
            <motion.span
              whileHover={{ scale: 0.9 }}
              className="p-3 rounded-md text-white hover:bg-primaryGreen bg-primaryGreen/70 cursor-pointer font-bold flex gap-2"
            >
              View List Of Categories <SquarePen />
            </motion.span>
          </Link>
        </div>
        {filteredCustomPack.length <= 0 ? (
          <div className="h-[50vh] flex items-center justify-center bg-white text-lg font-semibold">
            {" "}
            Custom package not available !!
          </div>
        ) : (
          <div className="flex flex-col gap-6 min-h-screen px-4">
            <div className="flex gap-4 flex-wrap items-stretch justify-center">
              {[...filteredCustomPack]
                .sort((a, b) => b.id - a.id)
                .map((pack) => (
                  <CustomPackageCard
                    key={pack.id}
                    customPackage={pack}
                    onApprove={handleApprove}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPackage;

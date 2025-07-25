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
import { Input } from "antd";

const CustomPackage = () => {
  const [custPack, setCustPack] = useState<CustomPackageData[]>([]);
  const [filteredCustomPack, setFilteredCustomPack] = useState<
    CustomPackageData[]
  >([]);
  const [loading, setloading] = useState(false);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { setActiveModalId } = useAppContext();

  useEffect(() => {
    getCustomData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, priceFilter, custPack]);

  const getCustomData = async () => {
    setloading(true);
    const result = await getCustomPackage();
    if (result.success) {
      setCustPack(result.data);
      setFilteredCustomPack(result.data);
    }
    setloading(false);
  };

  const handleDelete = async (packageId: number) => {
    try {
      const result = await DeleteCustomPackage(packageId);
      if (result) {
        const updated = custPack.filter((pkg) => pkg.id !== packageId);
        setCustPack(updated);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...custPack];

    // Filter by name
    if (search) {
      filtered = filtered.filter((pkg) =>
        pkg.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by price
    if (priceFilter !== null) {
      filtered = filtered.filter((pkg) =>
        pkg.total_price.includes(priceFilter.toString())
      );
    }

    setFilteredCustomPack(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredCustomPack
    .sort((a, b) => b.id - a.id)
    .slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredCustomPack.length / itemsPerPage);

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="w-full mx-auto">
        <div className="flex justify-between gap-4 w-full px-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Custom Tour Packages
          </h1>
          <Link href="/dashboard/service/customer-package">
            <motion.span
              whileHover={{ scale: 0.95 }}
              className="p-3 rounded-md text-white hover:bg-primaryGreen bg-primaryGreen/70 cursor-pointer font-bold flex gap-2"
            >
              View List Of Categories <SquarePen />
            </motion.span>
          </Link>
        </div>

        {/* Filter + Search */}
        <div className="bg-white shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-between px-4">
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[300px]"
          />
          <Input
            type="number"
            placeholder="Filter by price"
            value={priceFilter !== null ? priceFilter : ""}
            onChange={(e) =>
              setPriceFilter(e.target.value ? parseFloat(e.target.value) : null)
            }
            className="w-full md:w-[200px]"
          />
        </div>

        {paginatedData.length <= 0 ? (
          <div className="h-[40vh] flex items-center justify-center bg-white text-lg font-semibold">
            No packages found.
          </div>
        ) : (
          <>
            <div className="flex gap-4 flex-wrap items-stretch justify-evenly">
              {paginatedData.map((pack) => (
                <CustomPackageCard
                  key={pack.id}
                  customPackage={pack}
                  onApprove={() => {}}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded ${
                    currentPage === index + 1
                      ? "bg-primaryGreen text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomPackage;

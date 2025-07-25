"use client";
import { SquarePen } from "lucide-react";
import React, { useEffect, useState } from "react";
import AccommodationTable from "./accomTable";
import {
  categoryCounts,
  DeleteAccommodation,
  getAccommodationCategory,
  getAllAccomodations,
} from "@/app/api/accommodation/action";
import { AccommodationType } from "@/app/types/service/accommodation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import message from "antd/es/message";
import { Spin } from "antd";

const AdminAccommodationTable = () => {
  const [loading, setLoading] = useState(true);
  const [accomList, setAccomList] = useState<AccommodationType[]>([]);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [categories, setCategories] = useState<categoryCounts[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAccommodations = accomList.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toString().includes(searchTerm);

    const matchesCategory = selectedCategory
      ? a.category === selectedCategory
      : true;

    const matchesLocation = location
      ? a.location.toLowerCase().includes(location.toLowerCase())
      : true;

    const matchesMinPrice =
      minPrice !== null ? a.lowest_price >= minPrice : true;
    const matchesMaxPrice =
      maxPrice !== null ? a.lowest_price <= maxPrice : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const totalPages = Math.ceil(filteredAccommodations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAccommodations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getAllAccommodations();
  }, []);

  const getAllAccommodations = async () => {
    setLoading(true);
    try {
      const result = await getAllAccomodations();
      const data = await getAccommodationCategory();
      if (result.success) setAccomList(result.data);
      if (data.success) {
        setCategories(data.data);
      }
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

        {/* Filter & Search UI */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 w-full">
          <input
            type="text"
            placeholder="Search by name or ID"
            className="p-2 border rounded flex-1 "
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded flex-1 "
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filter by location"
            className="p-2 border rounded flex-1 "
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Price"
            className="p-2 border rounded "
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="p-2 border rounded "
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <AccommodationTable
              accom={currentItems}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onView={handleView}
              loading={loading}
              totalPages={totalPages}
              currentPage={currentPage}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={handlePageChange}
            />

            {filteredAccommodations.length === 0 && (
              <p className="text-gray-500 mt-6 text-center">
                No accommodations found.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAccommodationTable;

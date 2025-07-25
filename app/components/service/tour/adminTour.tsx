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
import { Input, Select } from "antd";
import { getAllToursData } from "@/app/helpers/filter";
const { Search } = Input;

function AdminTourServiceApp() {
  const [loading, setLoading] = useState(true);
  const [packageList, setPackageList] = useState<TourDataType>({});
  const router = useRouter();

  const [filteredList, setFilteredList] = useState<TourDataType>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: 0,
    status: "",
    duration: "",
  });

  useEffect(() => {
    getAllTourPackages();
  }, []);

  const getAllTourPackages = async () => {
    setLoading(true);
    try {
      const result = await getAllTours();
      if (result.success) {
        setPackageList(result.data);
        setFilteredList(result.data);
      }
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
    router.push(`/dashboard/service/tour/${tourPackage}`);
  };

  const handleView = (tourPackage: number) => {
    router.push(`/dashboard/service/tour/${tourPackage}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
    applyFilters({ ...filters }, value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    applyFilters(updatedFilters, searchTerm);
  };

  const applyFilters = (
    activeFilters: typeof filters,
    keyword: string = ""
  ) => {
    const allTours = getAllToursData(packageList);
    const filtered = allTours.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(keyword) ||
        tour.id.toString().includes(keyword);

      const matchesCountry =
        !activeFilters.country || tour.country === activeFilters.country;

      const matchesStatus =
        !activeFilters.status ||
        (activeFilters.status === "active" && tour.is_active) ||
        (activeFilters.status === "inactive" && !tour.is_active);

      const matchesDuration =
        !activeFilters.duration ||
        tour.duration_days.toString() === activeFilters.duration;

      return (
        matchesSearch && matchesCountry && matchesStatus && matchesDuration
      );
    });

    const grouped: TourDataType = {};
    for (const tour of filtered) {
      if (!grouped[tour.country]) grouped[tour.country] = [];
      grouped[tour.country].push(tour);
    }

    setFilteredList(grouped);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Search
            placeholder="Search by title or ID"
            allowClear
            size="large"
            onSearch={handleSearch}
            className="w-full  "
          />
          {/* <Select
            placeholder="Filter by Country"
            allowClear
            size="large"
            onChange={(value) => handleFilterChange("country", value)}
            options={Object.keys(getAllToursData(packageList)).map((key) => ({
              label: `${key}`,
              value: key,
            }))}
          /> */}
          <Select
            placeholder="Status"
            allowClear
            size="large"
            onChange={(value) => handleFilterChange("status", value)}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />

          <Select
            placeholder="Duration (days)"
            allowClear
            size="large"
            onChange={(value) => handleFilterChange("duration", value)}
            options={[1, 2, 3, 4, 5, 6, 7].map((d) => ({
              label: `${d} Day${d > 1 ? "s" : ""}`,
              value: d.toString(),
            }))}
          />
        </div>

        <TourPackagesTable
          tour={filteredList}
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

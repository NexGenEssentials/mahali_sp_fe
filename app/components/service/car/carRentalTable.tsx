"use client";
import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Car,
  ChevronLeft,
  ChevronRight,
  Eye,
  Fuel,
  Users,
  Briefcase,
} from "lucide-react";
import { CarResponse } from "@/app/types/service";
import Image from "next/image";
import Popconfirm from "antd/es/popconfirm";

interface Feature {
  id: number;
  name: string;
}

interface RelatedCar {
  id: number;
  name: string;
  category: string;
  transmission: string;
}

interface CarData {
  id: number;
  features: Feature[];
  first_image: string | null;
  images: string[];
  related_cars: RelatedCar[];
  owner: number;
  name: string;
  brand: string;
  category: string;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  luggage_capacity: number;
  price_per_day: string;
  is_available: boolean;
}

interface CarRentalTableProps {
  data: CarResponse;
  onDelete: (id: number) => void;
  onUpdate: (car: CarData) => void;
  onView: (car: number) => void;
}

const CarRentalTable: React.FC<CarRentalTableProps> = ({
  data,
  onDelete,
  onUpdate,
  onView,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data?.data?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.data?.length! / itemsPerPage);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage) + " km";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specifications
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...(currentItems ?? [])]
              .sort((a, b) => b.id - a.id)
              ?.map((car) => (
                <tr
                  key={car.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{car.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {car.first_image ? (
                        <div className="relative w-60 h-40">
                          <Image
                            src={car.first_image}
                            alt={car.name}
                            fill
                            className="h-40 w-40 object-cover rounded-md mr-4"
                          />
                        </div>
                      ) : (
                        <div className="h-40 w-40 bg-gray-200 rounded-md flex items-center justify-center mr-4">
                          <Car className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {car.brand} {car.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {car.year} • {car.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 space-y-1">
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                        {car.fuel_type} • {car.transmission}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {car.seats} seats
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        {car.luggage_capacity} bags
                      </div>
                      <div className="text-xs text-gray-500">
                        Mileage: {formatMileage(car.mileage)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex flex-wrap gap-1">
                      {car.features.map((feature) => (
                        <span
                          key={feature.id}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                        >
                          {feature.name}
                        </span>
                      ))}
                      {car.features.length === 0 && (
                        <span className="text-sm text-gray-500">
                          No features listed
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(car.price_per_day)}
                    </div>
                    <div className="text-xs text-gray-500">per day</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        car.is_available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {car.is_available ? "Available" : "Not Available"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(car.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        // onClick={() => onUpdate(car)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <Popconfirm
                        title="Are you sure you want to delete this booking?"
                        onConfirm={() => onDelete(car.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                          style: {
                            backgroundColor: "#3f5a2e",
                            borderColor: "#16a34a",
                          },
                          type: "primary",
                        }}
                        cancelButtonProps={{
                          style: { color: "#dc2626" },
                        }}
                      >
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(endIndex, data?.data?.length!)}
              </span>{" "}
              of <span className="font-medium">{data?.data?.length!}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === index + 1
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalTable;

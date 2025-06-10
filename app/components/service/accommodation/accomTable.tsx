"use client";
import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import Loader from "@/app/components/skeleton/loader";
import { AccommodationType } from "@/app/types/service/accommodation";
import { useRouter } from "next/navigation";
import Popconfirm from "antd/es/popconfirm";

interface AccommodationTableProps {
  accom: AccommodationType[];
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  onView: (id: number, category: string) => void;
  loading: boolean;
}

const AccommodationTable: React.FC<AccommodationTableProps> = ({
  accom,
  onDelete,
  onUpdate,
  onView,
  loading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = accom.slice(startIndex, endIndex);
  const totalPages = Math.ceil(accom.length / itemsPerPage);
  const route = useRouter();

  const renderRatingStars = (rating: number) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}</span>
    </div>
  );

  const handleCreateRoomType = (accommodationId: number) => {
    route.push(
      `/dashboard/service/accommodation/${accommodationId}/create-room-type`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
      <table className="divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {[
              "ID",
              "Name",
              "Location",

              "Category",
              "Rating",

              "Created At",

              "In/Out",

              "Lowest Price",
              "Add Room Type",

              "Actions",
            ].map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-4 whitespace-nowrap border border-gray-200 bg-gray-50 font-medium text-gray-600 uppercase text-xs"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={26} className="text-center py-4">
                <Loader />
              </td>
            </tr>
          ) : (
            [...currentItems]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{a.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{a.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{a.location}</td>

                  <td className="px-6 py-4 whitespace-nowrap">{a.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderRatingStars(a.rating)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {a.check_in_time}/{a.check_out_time}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    ${a.lowest_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCreateRoomType(a.id)}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline duration-200 transition"
                      title="Add Room Type"
                    >
                      Add Room Type
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(a.id, a.category)}
                        className="text-blue-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onUpdate(a.id)}
                        className="text-indigo-600"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                     
                      <Popconfirm
                        title="Are you sure you want to delete this booking?"
                        onConfirm={() => onDelete(a.id)}
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
              ))
          )}
        </tbody>
      </table>
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
                {Math.min(endIndex, accom.length)}
              </span>{" "}
              of <span className="font-medium">{accom.length}</span> results
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

export default AccommodationTable;

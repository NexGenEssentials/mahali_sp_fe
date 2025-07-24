"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomType } from "@/app/types/service/accommodation";
import { FaEdit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import Popconfirm from "antd/es/popconfirm";
import { DeleteRoomType } from "@/app/api/accommodation/action";
import { message } from "antd";

interface RoomTypesTableProps {
  roomTypes: RoomType[];
  accommodationId: string | number;
}

const RoomTypesTable: React.FC<RoomTypesTableProps> = ({
  roomTypes: initialRoomTypes,
  accommodationId,
}) => {
  const router = useRouter();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(roomTypes.length / itemsPerPage);
  const paginatedRoomTypes = roomTypes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (roomId: number) => {
    router.push(
      `/dashboard/service/accommodation/${accommodationId}/room-type/${roomId}`
    );
  };

  const handleDelete = async (roomId: number) => {
    try {
      const result = await DeleteRoomType(roomId);

      if (result) {
        message.success("Room Type deleted successfully");
        setRoomTypes((prev) => prev.filter((room) => room.id !== roomId));
      } else {
        message.error("Room Type not found");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      message.error("An error occurred while deleting the room type");
    }
  };

  if (roomTypes.length <= 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          No Room Types Available
        </h2>
        <p className="text-gray-600">
          Currently, there are no room types available for this accommodation.
        </p>
        <button
          className="mt-4 px-6 py-2 bg-primaryGreen/70 text-white rounded-lg hover:bg-primaryGreen transition-colors"
          onClick={() =>
            router.push(
              `/dashboard/service/accommodation/${accommodationId}/create-room-type`
            )
          }
        >
          Add Room Type
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white p-4 rounded">
      <div className="flex items-center gap-2 justify-between pb-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Room Types</h2>
        <button
          className="px-6 py-2 bg-primaryGreen/70 text-white rounded-lg hover:bg-primaryGreen transition-colors"
          onClick={() =>
            router.push(
              `/dashboard/service/accommodation/${accommodationId}/create-room-type`
            )
          }
        >
          Add Room Type
        </button>
      </div>
      <table className="w-full min-w-[1000px] table-auto border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Guests</th>
            <th className="px-4 py-2 text-left">Children</th>
            <th className="px-4 py-2 text-left">Bed Type</th>
            <th className="px-4 py-2 text-left">Size</th>
            <th className="px-4 py-2 text-left">Includes</th>
            <th className="px-4 py-2 text-left">Availability</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRoomTypes.map((room) => (
            <tr key={room.id} className="border-t border-gray-200">
              <td className="px-4 py-3">{room.name}</td>
              <td className="px-4 py-3">${room.price_per_night}</td>
              <td className="px-4 py-3">{room.max_guests}</td>
              <td className="px-4 py-3">{room.max_children}</td>
              <td className="px-4 py-3">{room.bed_type}</td>
              <td className="px-4 py-3">{room.size} ft²</td>
              <td className="px-4 py-3">{room.includes}</td>
              <td className="px-4 py-3">
                {room.is_available ? (
                  <span className="text-green-600 font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Not Available
                  </span>
                )}
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => handleEdit(room.id)}
                  className="text-blue-600 hover:underline"
                >
                  <FaEdit />
                </button>

                <Popconfirm
                  title="Are you sure you want to delete this room type?"
                  onConfirm={() => handleDelete(room.id)}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center text-white mt-4 space-x-2">
        <button
          className="px-3 py-1 border rounded bg-primaryGreen disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-slate-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded bg-primaryGreen disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoomTypesTable;

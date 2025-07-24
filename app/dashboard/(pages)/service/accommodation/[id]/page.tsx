"use client";
import React, { useState, useEffect } from "react";
import { AccommodationType, RoomType } from "@/app/types/service/accommodation";
import { getAccommodation } from "@/app/api/accommodation/action";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/skeleton/loader";
import RoomTypesTable from "@/app/components/service/accommodation/roomtypeTable";
import { message } from "antd";

const AccommodationDetails = ({ params }: { params: { id: number } }) => {
  const [accommodation, setAccommodation] = useState<AccommodationType | null>(
    null
  );
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        const response = await getAccommodation(params.id);
        if (response.success) {
          message.success(response.message);
          setAccommodation(response.data);
          setRoomTypes(response.data.room_types);
        } else {
          message.warning("something went wrong");
        }
      } catch (error) {
        console.error("Error fetching accommodation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [params.id]);

  if (loading) {
    return <Loader />;
  }

  if (!accommodation) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Accommodation Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          We couldn't retrieve the details of this accommodation. It may have
          been deleted or the link is invalid.
        </p>
        <button
          onClick={() => router.push("/dashboard/service")}
          className="px-6 py-2 bg-primaryGreen text-white rounded hover:bg-primaryGreen/80 transition"
        >
          Go Back to Accommodations
        </button>
      </div>
    );
  }

  const fallbackImage =
    "https://via.placeholder.com/1200x600?text=No+Image+Available";
  const imageSrc = accommodation.first_image || fallbackImage;

  return (
    <ServiceProviderTemplate>
      <div className="max-w-7xl mx-auto my-10 px-4">
        {/* Hero Section */}
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
          <img
            src={imageSrc}
            alt={accommodation.name}
            className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              {accommodation.name}
            </h1>
            {accommodation.rating && (
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-xl mr-2">★</span>
                <span className="text-white text-lg">
                  {accommodation.rating}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Description */}
          <p className="text-gray-700 mb-6">{accommodation.description}</p>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Location
            </h2>
            <p className="text-gray-600">
              <span className="font-medium">Address:</span>{" "}
              {accommodation.address}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Country:</span>{" "}
              {accommodation.location}
            </p>
          </div>

          {/* Facilities */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Facilities
            </h2>
            {accommodation.facilities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {accommodation.facilities.map((facility) => (
                  <span
                    key={facility.id}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm shadow-sm"
                  >
                    {facility.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No facilities information provided.
              </p>
            )}
          </div>

          {/* House Rules */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              House Rules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
              <p>
                <strong>Check-in:</strong>{" "}
                {accommodation.house_rules.check_in_time}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {accommodation.house_rules.check_out_time}
              </p>
              <p>
                <strong>Smoking:</strong>{" "}
                {accommodation.house_rules.smoking_allowed
                  ? "Allowed"
                  : "Not Allowed"}
              </p>
              <p>
                <strong>Pets:</strong>{" "}
                {accommodation.house_rules.pets_allowed
                  ? "Allowed"
                  : "Not Allowed"}
              </p>
            </div>
            {accommodation.house_rules.additional_rules && (
              <p className="mt-4 text-gray-700">
                <strong>Additional Rules:</strong>{" "}
                {accommodation.house_rules.additional_rules}
              </p>
            )}
          </div>
        </div>

        {/* Room Types */}
        <RoomTypesTable roomTypes={roomTypes} accommodationId={params.id} />
      </div>
    </ServiceProviderTemplate>
  );
};

export default AccommodationDetails;

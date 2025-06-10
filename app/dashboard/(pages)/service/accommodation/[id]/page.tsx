"use client";
import React, { useState, useEffect } from "react";
import { AccommodationType, RoomType } from "@/app/types/service/accommodation";
import { getAccommodation } from "@/app/api/accommodation/action";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/skeleton/loader";

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
        setAccommodation(response.data.accommodation);
        setRoomTypes(response.data.room_types);
      } catch (error) {
        console.error("Error fetching accommodation details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [params.id]);

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (!accommodation) {
    return (
      <div className="text-center py-10 text-xl font-medium">
        No accommodation details found.
      </div>
    );
  }

  const fallbackImage =
    "https://via.placeholder.com/1200x600?text=No+Image+Available";
  const imageSrc = accommodation.first_image || fallbackImage;

  return (
    <ServiceProviderTemplate>
      <div className="max-w-6xl mx-auto my-10 px-4">
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
        {roomTypes.length <= 0 ? (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              No Room Types Available
            </h2>
            <p className="text-gray-600">
              Currently, there are no room types available for this
              accommodation.
            </p>
            <button
              className="mt-4 px-6 py-2 bg-primaryGreen/70 text-white rounded-lg hover:bg-primaryGreen transition-colors"
              onClick={() =>
                router.push(
                  `/dashboard/service/accommodation/${params.id}/create-room-type`
                )
              }
            >
              Add Room Type
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Room Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {roomTypes.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <p>
                      <strong>Price per Night:</strong> ${room.price_per_night}
                    </p>
                    <p>
                      <strong>Max Guests:</strong> {room.max_guests}
                    </p>
                    <p>
                      <strong>Max Children:</strong> {room.max_children}
                    </p>
                    <p>
                      <strong>Bed Type:</strong> {room.bed_type}
                    </p>
                    <p>
                      <strong>Room Size:</strong> {room.size} sq ft
                    </p>
                    <p>
                      <strong>Includes:</strong> {room.includes}
                    </p>
                    <p>
                      <strong>Availability:</strong>{" "}
                      {room.is_available ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ServiceProviderTemplate>
  );
};

export default AccommodationDetails;

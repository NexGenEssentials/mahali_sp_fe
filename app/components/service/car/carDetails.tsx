"use client";
import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { CarData, SingleCarType } from "@/app/types/service";
import imagePlacholder from "@/public/images/imagePlaceholder.jpg";
import { getSingleCar } from "@/app/api/carRental/action";
import Loader from "@/app/components/skeleton/loader";

const CarDetails = ({ carId }: { carId: number }) => {
  const [carInfo, setCarInfo] = useState<SingleCarType>({
    car: {} as StaticImageData,
    gallery: undefined,
    spec: null,
    id: 0,
    features: [],
    first_image: {} as StaticImageData,
    images: [],
    related_cars: [],
    owner: 0,
    name: "",
    brand: "",
    category: "",
    year: 0,
    mileage: 0,
    fuel_type: "Petrol",
    transmission: "Automatic",
    seats: 0,
    luggage_capacity: 0,
    price_per_day: "0.00",
    is_available: false,
    status: "",
    description: "",
    location:"",
  });
  const [loading, setloading] = useState(true);

  useEffect(() => {
    getCarById();
  }, []);
  const getCarById = async () => {
    setloading(true);
    try {
      const result = await getSingleCar(String(carId));
      if (carInfo) {
        setCarInfo(result);
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    } finally {
      setloading(false);
    }
  };

  if (loading) return (
    <div className="lg:min-w-[700px]">
      <Loader />
    </div>
  );
  return (
    <div className="p-6 lg:min-w-[700px] mx-auto max-h-[70vh] overflow-y-scroll">
      {/* Car Main Image */}
      <div className="p-4 rounded-lg shadow-md">
        <Image
          src={carInfo.first_image || imagePlacholder}
          alt={`${carInfo?.name}`}
          width={500}
          height={300}
          className="w-full h-64 object-cover rounded-md"
        />
        <h2 className="text-2xl font-bold mt-4">{carInfo?.name}</h2>
        <p className="text-gray-500">
          {carInfo?.brand} - {carInfo?.year}
        </p>
      </div>

      {/* Features */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Features</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {carInfo?.features.map((feature) => (
            <div
              key={feature.id}
              className="text-white p-2 rounded-md bg-primaryGreen/80"
            >
              {feature.name}
            </div>
          ))}
        </div>
      </div>

      {/* Car Details */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <p>
          <strong>Category:</strong> {carInfo?.category}
        </p>
        <p>
          <strong>Transmission:</strong> {carInfo?.transmission}
        </p>
        <p>
          <strong>Fuel Type:</strong> {carInfo?.fuel_type}
        </p>
        <p>
          <strong>Seats:</strong> {carInfo?.seats}
        </p>
        <p>
          <strong>Mileage:</strong> {carInfo?.mileage} km
        </p>
        <p>
          <strong>Luggage Capacity:</strong> {carInfo?.luggage_capacity} L
        </p>
        <p>
          <strong>Price per day:</strong> ${carInfo?.price_per_day}
        </p>
        <p>
          <strong>Availability:</strong>{" "}
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              carInfo?.is_available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {carInfo?.is_available ? "Available" : "Not Available"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CarDetails;

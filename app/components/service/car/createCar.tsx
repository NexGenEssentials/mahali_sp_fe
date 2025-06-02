"use client";
import { message, Switch } from "antd";
import { useState } from "react";
import { CarImages } from "./addImages";
import { CreateCar } from "@/app/api/carRental/action";
import { CarDetails } from "@/app/types/service";
import { carTypesData } from "@/app/costant";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function AddVehicleForm() {
  const [formData, setFormData] = useState<CarDetails>({
    owner: 0,
    name: "",
    brand: "",
    category: "",
    year: "",
    mileage: 0,
    fuel_type: "Petrol",
    transmission: "Automatic",
    seats: 5,
    luggage_capacity: 0,
    price_per_day: "",
    is_available: true,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [carId, setCarId] = useState(1);
  const router = useRouter();
    const carBrands = [
    "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", "Hyundai", "Kia", "Volkswagen",
    "BMW", "Mercedes-Benz", "Audi", "Lexus", "Mazda", "Subaru", "Jeep", "Dodge",
    "GMC", "Tesla", "Volvo", "Porsche", "Jaguar", "Land Rover"
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev: CarDetails) => ({
      ...prev,
      [name]: type === "number" ? parseInt(newValue as string) : newValue,
    }));
  };

  const onChange = (checked: boolean) => {
    setFormData((prev: CarDetails) => ({
      ...prev,
      is_available: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await CreateCar(formData);

      if (result.status === "success") {
        setCarId(result.data.id);
        setStep(2);
        message.success("Car created successfully");
      }
      if (!result.status) {
        message.error("Failed to create car check the details");
      }
    } catch (error) {
      console.error("Error creating car:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => router.push("/service")}
        className="border-b-2 w-fit flex items-center gap-1 duration-200  mb-2 text-sm text-slate-400 hover:text-slate-500 font-semibold hover:border-primaryGreen cursor-pointer"
      >
        <IoMdArrowRoundBack /> Go Back
      </div>
      {step === 1 && (
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold">Add New Vehicle</h2>
            <p className="text-gray-600">
              Complete the form below to add a new vehicle to your fleet
            </p>
          </div>

          {/* Basic Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">
              Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Name
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="e.g. Camry XLE"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              {/* Brand Input */}
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="" disabled>
                    Select a brand
                  </option>
                  {carBrands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Select */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="" disabled>
                    Select a category
                  </option>

                  {carTypesData.car_types.map((type, index) => (
                    <option key={index} value={type.type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label
                  htmlFor="owner"
                  className="block text-sm font-medium text-gray-700"
                >
                  Owner Id
                </label>
                <input
                  name="owner"
                  type="number"
                  value={formData.owner}
                  onChange={handleChange}
                  className="input"
                />
              </div> */}
            </div>
            <>
              <label
                htmlFor="owner"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter vehicle description"
                className="input"
                rows={3}
              />
            </>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">
              Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year Input */}
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. 2023"
                />
              </div>

              {/* Mileage Input */}
              <div>
                <label
                  htmlFor="mileage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mileage (km)
                </label>
                <input
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. 15000"
                />
              </div>

              {/* Fuel Type Select */}
              <div>
                <label
                  htmlFor="fuel_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fuel Type
                </label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="" disabled>
                    Select fuel type
                  </option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>
              </div>

              {/* Transmission Select */}
              <div>
                <label
                  htmlFor="transmission"
                  className="block text-sm font-medium text-gray-700"
                >
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="" disabled>
                    Select transmission
                  </option>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>

              {/* Seats Input */}
              <div>
                <label
                  htmlFor="seats"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Seats
                </label>
                <input
                  id="seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. 5"
                />
              </div>

              {/* Luggage Capacity Input */}
              <div>
                <label
                  htmlFor="luggage_capacity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Luggage Capacity
                </label>
                <input
                  id="luggage_capacity"
                  name="luggage_capacity"
                  type="number"
                  value={formData.luggage_capacity}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. 5"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-1">
              Pricing & Availability
            </h3>
            <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-4">
              <div className="">
                <label
                  htmlFor="price_per_day"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price per Day ($)
                </label>
                <input
                  name="price_per_day"
                  value={formData.price_per_day}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center justify-between gap-2 border p-2 rounded-md">
                <div>
                  <span className="flex items-center gap-2">
                    Available for Rent
                  </span>
                  <span className="text-sm text-gray-500">
                    Mark this vehicle as available
                  </span>
                </div>

                <Switch className="" defaultChecked onChange={onChange} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => router.push("/dashboard/service")}
              type="button"
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-primaryGreen/80 transition duration-300"
            >
              {loading ? "Creating..." : " Add Vehicle"}
            </button>
          </div>
        </form>
      )}
      {step === 2 && <CarImages carId={carId} />}
    </>
  );
}

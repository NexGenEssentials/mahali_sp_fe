"use client";
import { DeleteActivityPackage } from "@/app/api/tour/action";
import { CustomPackageData, PackageActivityData } from "@/app/types/service/tour";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  customPackage: CustomPackageData;

  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
};

const CustomPackageCard: React.FC<Props> = ({
  customPackage,

  onDelete,
  onApprove,
}) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activityList, setActivityList] = useState<PackageActivityData[]>(
    customPackage.package_activities
  );
  const [totalPrice, setTotalPrice] = useState<number>(
    Number(customPackage.total_price)
  );
  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteActivity = async (
    activityPrice: number,
    activityId: number
  ) => {
    try {
      const result = await DeleteActivityPackage(customPackage.id, activityId);
      if (result) {
        setActivityList((prev) =>
          prev.filter((activity) => activity.id !== activityId)
        );
        setTotalPrice((prev) => prev - activityPrice);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 ease-in-out flex flex-col justify-between min-h-[350px] w-full max-w-sm border border-gray-100">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primaryGreen mb-2">
            {customPackage.name}
          </h2>
          <span className="relative" ref={dropdownRef}>
            <Icon
              onClick={() => setShow(!show)}
              icon="pepicons-pop:dots-y"
              width="25"
              height="25"
              className="text-primaryGreen cursor-pointer"
            />
            {show && (
              <div className="absolute top-6 right-0 shadow-xl bg-white rounded-lg p-3 space-y-2 min-w-20 z-30 border">
            
                <span
                  onClick={() => onDelete(customPackage.id)}
                  className="flex items-center gap-2 hover:bg-gray-100 hover:text-red-500 rounded-md text-sm px-4 py-1 text-primaryGreen cursor-pointer"
                >
                  <Icon
                    icon="weui:delete-outlined"
                    width="18"
                    height="18"
                    className="text-red-500 cursor-pointer"
                  />
                  Delete
                </span>
              </div>
            )}
          </span>
        </div>

        <p className="text-gray-500 mb-4">
          Total Price:{" "}
          <span className="font-semibold text-defaultGreen">
            ${totalPrice.toLocaleString()}
          </span>
        </p>

        {activityList.length > 0 && (
          <div className="space-y-2 overflow-y-scroll max-h-[300px] p-2 rounded-lg bg-slate-100">
            {activityList.map((activity, index) => (
              <div
                key={activity.id}
                className="relative group bg-white p-3 rounded-lg border border-gray-200"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {index + 1}. {activity.activity.name}
                </p>
                <p className="text-xs text-gray-500">
                  Location: {activity.activity.location}
                </p>
                <p className="text-xs text-gray-500">
                  Days: {activity.number_of_days} | Subtotal: $
                  {activity.sub_total_price}
                </p>
                <div
                  onClick={() =>
                    handleDeleteActivity(
                      Number(activity.sub_total_price),
                      activity.id
                    )
                  }
                  className="hidden group-hover:block duration-500 transition-all absolute -top-1 -right-1 "
                >
                  <Icon
                    icon="pajamas:clear"
                    width="16"
                    height="16"
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <button
        onClick={() => onApprove(customPackage.id)}
        className="flex items-center justify-center mt-6 border border-primaryGreen text-defaultGreen hover:bg-primaryGreen hover:text-white font-bold py-3 rounded-xl transition-all duration-300"
      >
        Approve Package
        <Icon
          icon="material-symbols:check-circle-outline"
          width="20"
          height="20"     
          className="inline-block ml-2"
        />
      </button> */}
    </div>
  );
};

export default CustomPackageCard;

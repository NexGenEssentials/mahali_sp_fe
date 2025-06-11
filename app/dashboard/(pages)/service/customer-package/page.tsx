"use client";
import {
  DeleteActivities,
  DeleteCategory,
  getTourCategories,
} from "@/app/api/tour/action";
import CreateTourActivityForm from "@/app/components/form/createActivityForm";
import CreateTourCategoryForm from "@/app/components/form/createCategory";
import CenterModal from "@/app/components/model/centerModel";
import Loader from "@/app/components/skeleton/loader";
import { useAppContext } from "@/app/context";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import { CategoryType } from "@/app/types/service/tour";
import { message } from "antd";
import { motion } from "framer-motion";
import { SquarePen } from "lucide-react";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

const CreateCustomActivity = () => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [catloading, setCatLoading] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number>(1);
  const { setActiveModalId } = useAppContext();

  useEffect(() => {
    getCategoryList();
  }, [catloading]);

  const getCategoryList = async () => {
    setLoading(true);
    try {
      const result = await getTourCategories();
      setCategoryList(result.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const totalPages = Math.ceil(categoryList.length / ITEMS_PER_PAGE);
  let displayedCategories = categoryList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const result = await DeleteCategory(id);
      if (result) {
        message.success("Category Deleted Successfully");
        setCategoryList((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        message.error("Category Not Found");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleDeleteActivity = async (id: number) => {
    setDeleteLoading(true);
    try {
      const result = await DeleteActivities(id);
      if (result) {
        message.success("Activity Deleted Successfully");
        setCategoryList((prev) =>
          prev.map((cat) => ({
            ...cat,
            activities: cat.activities?.filter((act) => act.id !== id) || [],
          }))
        );
      } else {
        message.error("Activity Not Found");
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };


  return (
    <ServiceProviderTemplate>
      <div className="bg-white p-6">
        <div className="w-full mx-auto">
          <div className="flex justify-between gap-4 w-full px-4 mb-8 items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Custom Activity
            </h1>
            <motion.span
              onClick={() => {
                setActiveModalId("categoryModel");
              }}
              whileHover={{ scale: 0.9 }}
              className="p-3 rounded-md text-white hover:bg-primaryGreen bg-primaryGreen/70 cursor-pointer font-bold flex gap-2"
            >
              Create Category <SquarePen />
            </motion.span>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <>
              <table className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Id</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-center">Total Activity</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.length === 0 ? (
                    <tr className="">
                      <td
                        colSpan={5}
                        className="p-32 border text-center text-gray-500"
                      >
                        No categories available. Please create a category.
                      </td>
                    </tr>
                  ) : (
                    displayedCategories.map((category) => (
                      <React.Fragment key={category.id}>
                        <tr
                          className="cursor-pointer border-b hover:bg-gray-50"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <td className="p-3 text-center">{category.id}</td>
                          <td className="p-3">{category.name}</td>
                          <td className="p-3">
                            {category.description || "No description available"}
                          </td>
                          <td className="p-3 text-center">
                            {category.activities
                              ? category.activities.length
                              : 0}
                          </td>
                          <td className="flex items-center justify-center p-2">
                            <button
                              title="Delete This Category"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="bg-red-500 text-white p-2 text-sm rounded-lg"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                        {expandedCategory === category.id && (
                          <tr>
                            <td colSpan={5} className="p-4 bg-gray-50">
                              <div className="flex items-center justify-between gap-4">
                                <div className="mb-2 text-lg font-semibold text-gray-700">
                                  Activities:
                                </div>
                                <button
                                  onClick={() => {
                                    setCategoryId(category.id);
                                    setActiveModalId("activityModel");
                                  }}
                                  className="bg-primaryGreen text-white px-3 py-2 text-xs rounded-md hover:opacity-90 transition"
                                >
                                  Add Activities
                                </button>
                              </div>
                              {deleteLoading ? (
                                <Loader />
                              ) : category.activities &&
                                category.activities.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                                  {category.activities.map((activity) => (
                                    <div
                                      key={activity.id}
                                      className="relative bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                                    >
                                      <div className="font-bold text-gray-800 text-lg mb-1">
                                        {activity.name}
                                      </div>

                                      <div
                                        onClick={() =>
                                          handleDeleteActivity(activity.id)
                                        }
                                        title="Delete Activity"
                                        className="bg-red-600 hover:bg-red-400 duration-200 cursor-pointer text-white text-sm w-4 h-4 p-3 flex items-center justify-center rounded-full absolute -top-1 right-0"
                                      >
                                        {" "}
                                        X{" "}
                                      </div>

                                      <p className="text-gray-600 text-sm">
                                        <span className="font-semibold">
                                          Description:
                                        </span>{" "}
                                        {activity.description || "N/A"}
                                      </p>
                                      <p className="text-gray-600 text-sm ">
                                        <span className="font-semibold">
                                          Location:
                                        </span>{" "}
                                        {activity.location}
                                      </p>
                                      <p className="text-gray-600 text-sm">
                                        <span className="font-semibold">
                                          Price/Day:
                                        </span>{" "}
                                        $ {activity.price_per_day}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-600">
                                  No activities available.
                                </p>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination Buttons */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 bg-primaryGreen text-white rounded-md transition ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 bg-primaryGreen text-white rounded-md transition ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <CenterModal
        children={<CreateTourCategoryForm reload={setCatLoading} />}
        id={"categoryModel"}
      />
      <CenterModal
        children={
          <CreateTourActivityForm catId={categoryId} reload={setCatLoading} />
        }
        id={"activityModel"}
      />
    </ServiceProviderTemplate>
  );
};

export default CreateCustomActivity;

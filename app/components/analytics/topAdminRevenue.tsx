"use client";
import React, { FC } from "react";
import { CrownOutlined } from "@ant-design/icons";
import { Card } from "antd";
import LinkButton from "../buttons/linkButton";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TopRevenue } from "@/app/api/analytics/adminApi/action";

interface TopCustomersListProps {
  revenue: TopRevenue[];
}

const TopAdminRevenueList: FC<TopCustomersListProps> = ({ revenue }) => {
  return (
    <Card
      title={
        <div className="flex w-full items-center justify-between gap-2 text-lg font-semibold text-primaryBlue">
          <CrownOutlined /> Top User By Revenue Generated
          <LinkButton link="/users" />
        </div>
      }
      className="shadow-md rounded-xl"
    >
      {revenue.length <= 0 ? (
        <div className="min-h-80 font-bold text-primaryGreen text-xl flex items-center justify-center">
          {" "}
          Revenue list not available{" "}
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {revenue.map((revenue) => (
            <li
              key={revenue.id}
              className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md transition"
            >
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-800 capitalize flex items-center gap-1">
                  <FaUserCircle className="text-stone-500" />
                  {revenue.full_name}
                </p>
                <p className="text-gray-500  text-xs flex items-center gap-1">
                  <MdOutlineAlternateEmail /> {revenue.email}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-800">Total Spent</p>
                <p className="text-sm text-gray-800 font-bold text-center">
                  $ {Number(revenue?.total_spent).toLocaleString() || 0}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default TopAdminRevenueList;

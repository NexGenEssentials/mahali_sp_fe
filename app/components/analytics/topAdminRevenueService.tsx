"use client";
import React, { FC } from "react";
import { CrownOutlined } from "@ant-design/icons";
import { Card } from "antd";
import LinkButton from "../buttons/linkButton";
import { FaServicestack } from "react-icons/fa";
import { TopRevenueService,} from "@/app/api/analytics/adminApi/action";
import { HiMiniCurrencyDollar } from "react-icons/hi2";

interface TopCustomersListProps {
  servicesRevenue: TopRevenueService[];
}

const TopAdminRevenueServiceList: FC<TopCustomersListProps> = ({ servicesRevenue }) => {
  return (
    <Card
      title={
        <div className="flex w-full items-center justify-between gap-2 text-lg font-semibold text-primaryBlue">
          <CrownOutlined /> Top Revenue Generetage By Service Type
          <LinkButton link="/users" />
        </div>
      }
      className="shadow-md rounded-xl"
    >
      <ul className="divide-y divide-gray-200">
        {servicesRevenue.map((service) => (
          <li
            key={service.content_type}
            className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md transition"
          >
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-800 capitalize flex items-center gap-1">
                <FaServicestack className="text-stone-500" />
                {service.service_type}
              </p>
              <p className="text-gray-500  text-sm flex items-center gap-1">
                <HiMiniCurrencyDollar />{" "}
                {service.total_revenue.toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TopAdminRevenueServiceList;

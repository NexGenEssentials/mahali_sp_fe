"use client";
import React, { FC } from "react";
import { Card } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import LinkButton from "../buttons/linkButton";
import { TopService } from "@/app/api/analytics/adminApi/action";

interface TopCustomersListProps {
  services: TopService[];
}

const TopAdminServiceList: FC<TopCustomersListProps> = ({ services }) => {
  return (
    <Card
      title={
        <div className="flex w-full items-center justify-between gap-2 text-lg font-semibold text-primaryBlue">
          <CrownOutlined /> Top Service Booked By User
          <LinkButton link="/service" />
        </div>
      }
      className="shadow-md rounded-xl"
    >
      {services.length <= 0 ? (
        <div className="min-h-80 font-bold text-primaryGreen text-xl flex items-center justify-center">
          {" "}
          No Service data Available{" "}
        </div>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={services}>
              <XAxis dataKey="service_type" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                formatter={(value: any) =>
                  typeof value === "number" ? value.toLocaleString() : value
                }
              />
              <Legend />
              <Bar dataKey="count" name="Booking Count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default TopAdminServiceList;

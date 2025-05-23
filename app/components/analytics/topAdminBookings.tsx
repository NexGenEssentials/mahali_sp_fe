"use client";
import React, { FC } from "react";
import { Card, Table, Tooltip } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import { FaServicestack } from "react-icons/fa";
import { HiMiniCurrencyDollar } from "react-icons/hi2";
import LinkButton from "../buttons/linkButton";

import { TopBooking } from "@/app/api/analytics/adminApi/action";

interface TopCustomersListProps {
  bookings: TopBooking[];
}

const TopAdminBookingList: FC<TopCustomersListProps> = ({ bookings }) => {
  const columns = [
    {
      title: "Service",
      dataIndex: "item_name",
      key: "item_name",
      render: (text: string) => (
        <div className="flex items-center gap-2 font-medium text-slate-800 capitalize">
          <FaServicestack className="text-primaryBlue" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Service Type",
      dataIndex: "service_type",
      key: "service_type",
      render: (type: string) => (
        <Tooltip title="Service category">
          <span className="text-gray-600 font-semibold">{type}</span>
        </Tooltip>
      ),
    },
    {
      title: "Total Bookings",
      dataIndex: "count",
      key: "count",
      render: (count: number) => (
        <span className="text-gray-800 font-medium">
          {count.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Total Revenue",
      key: "revenue",
      render: (_: any, record: TopBooking) => (
        <span className="flex items-center gap-1 font-semibold text-green-600">
          <HiMiniCurrencyDollar />
          {(record.count * 1000).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center justify-between text-lg font-semibold text-primaryBlue">
          <span className="flex items-center gap-2">
            <CrownOutlined />
            Top Booked Services Item
          </span>
          <LinkButton link="/booking" />
        </div>
      }
      className="shadow-md rounded-xl"
    >
      <Table
        dataSource={bookings}
        columns={columns}
        rowKey={(record) => record.item_name + record.service_type}
        pagination={{ pageSize: 5 }}
        className="overflow-x-auto"
      />
    </Card>
  );
};

export default TopAdminBookingList;

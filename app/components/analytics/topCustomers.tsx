"use client";
import React, { FC } from "react";
import { CrownOutlined, UserOutlined, DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import LinkButton from "../buttons/linkButton";

type Customer = {
  user__id: number;
  user__full_name: string;
  bookings: number;
  total_spent: number;
};

interface TopCustomersListProps {
  customers: Customer[];
}

const TopCustomersList: FC<TopCustomersListProps> = ({ customers }) => {
  return (
    <Card
      title={
        <div className="flex max-w-sm min-w-[300px] w-full items-center justify-between gap-2 text-lg font-semibold text-primaryBlue">
          <CrownOutlined /> Top Customers
          <LinkButton link="/booking" />
        </div>
      }
      className="shadow-md rounded-xl max-w-sm"
    >
      <ul className="divide-y divide-gray-200">
        {customers.map((customer, index) => (
          <li
            key={customer.user__id}
            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition"
          >
            <div>
              <p className="text-base font-semibold text-gray-800 flex items-center gap-1">
                <UserOutlined className="text-blue-500" />
                {index + 1}. {customer.user__full_name}
              </p>
              <p className="text-sm text-gray-500">
                {customer.bookings} bookings
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-green-600 font-semibold flex items-center gap-1">
                <DollarOutlined /> ${customer.total_spent.toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TopCustomersList;

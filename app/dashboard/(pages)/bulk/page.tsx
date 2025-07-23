"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
  Select,
  Tag,
} from "antd";
const { Option } = Select;
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  DeleteMyBooking,
  getbulkBookings,
  updateBookingStatus,
} from "@/app/api/booking/action";
import Loader from "@/app/components/skeleton/loader";
import { BulkBookingType } from "@/app/types/booking";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";

const ListingBulkBooking: React.FC = () => {
  const [data, setData] = useState<BulkBookingType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [expandedRowKey, setExpandedRowKey] = useState<React.Key | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    handleGetbulkBookings();
  }, []);

  const handleGetbulkBookings = async () => {
    try {
      const response = await getbulkBookings();
      if (response.status === "success") {
        setData(response.data);
      } else {
        message.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId: number) => {
    try {
      const result = await DeleteMyBooking(bookingId);
      if (result) {
        message.success("Booking deleted successfully");
        setData((prev) => prev.filter((booking) => booking.id !== bookingId));
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const result = await updateBookingStatus(id, newStatus);
      message.success(`${result.message}
          ${result.message}
        }`);
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      handleGetbulkBookings();
    }
  };

  const filteredData = data.filter((item) =>
    item.note.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<BulkBookingType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      sorter: (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      sorter: (a, b) =>
        new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
    },
    {
      title: "Pickup",
      dataIndex: "pickup_location",
      sorter: (a, b) => a.pickup_location.localeCompare(b.pickup_location),
    },
    {
      title: "Trip Location",
      dataIndex: "trip_location",
    },
    {
      title: "Driver",
      dataIndex: "driver_option",
    },
    {
      title: "Note",
      dataIndex: "note",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: BulkBookingType) =>
        status === "pending" ? (
          <Select
            defaultValue={status}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Option value="confirm">Confirm</Option>
            <Option value="cancel">Cancel</Option>
          </Select>
        ) : (
          <Tag color={status === "confirmed" ? "green" : "red"}>
            {status.toUpperCase()}
          </Tag>
        ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   filters: [
    //     { text: "Pending", value: "pending" },
    //     { text: "Approved", value: "approved" },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    // },
    {
      title: "Action",
      key: "action",
      render: (_text, _record, index) => (
        <Popconfirm
          title="Are you sure to delete this booking?"
          onConfirm={() => handleDelete(index)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <ServiceProviderTemplate>
      <div className="p-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
          <h2 className="text-xl font-semibold">Bulk Bookings</h2>
          <Input
            placeholder="Search by note..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            expandable={{
              expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
              onExpandedRowsChange: (keys) => {
                const key = keys[0];
                setExpandedRowKey((prevKey) => (prevKey === key ? null : key));
              },
              expandedRowRender: (record: BulkBookingType) => {
                const carColumns = [
                  {
                    title: "Car Type",
                    dataIndex: "car_type",
                    key: "car_type",
                  },
                  {
                    title: "Car Model",
                    dataIndex: "model",
                    key: "model",
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                ];

                return (
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium mb-2">Car Details:</p>
                    <Table
                      columns={carColumns}
                      dataSource={record.car_details.map((car, index) => ({
                        ...car,
                        key: index,
                      }))}
                      pagination={false}
                      size="small"
                    />
                  </div>
                );
              },
            }}
            className="bg-white rounded-md shadow-sm"
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
    </ServiceProviderTemplate>
  );
};

export default ListingBulkBooking;

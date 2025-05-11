"use client";
import React, { useState, useEffect, Key } from "react";
import { Icon } from "@iconify/react";
import {
  Table,
  Pagination,
  Spin,
  Select,
  Input,
  Button,
  Popconfirm,
  Tag,
  notification,
} from "antd";
import {
  DeleteMyBooking,
  getAllMyBookings,
  updateBookingStatus,
} from "@/app/api/booking/action";
import { BookingData } from "@/app/types/booking";
import Loader from "@/app/components/skeleton/loader";
import Title from "@/app/components/header/title";
import { useAppContext } from "@/app/context";

const { Option } = Select;
const { Search } = Input;

function BookingsTable() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;

  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllMyBookings();
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const result = await updateBookingStatus(id, newStatus);
      notification.success({
        message: result.message,
        description: result.message,
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      fetchBookings();
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = bookings.filter(
      (booking) =>
        booking.id.toString().includes(value) ||
        booking.content_type.toLowerCase().includes(value.toLowerCase()) ||
        booking.booking_reference.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBookings(filteredData);
    setCurrentPage(1);
  };

  const handleView = (bookingId: number, type: string, rowKey: number) => {
    // Toggle expand/collapse
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(rowKey)
        ? prevKeys.filter((key) => key !== rowKey)
        : [...prevKeys, rowKey]
    );
  };

  const handleDelete = async (bookingId: number) => {
    try {
      const result = await DeleteMyBooking(bookingId);
      if (result)
        setFilteredBookings((prev) =>
          prev.filter((booking) => booking.id !== bookingId)
        );
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_: any, __: BookingData, index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      title: "Booking Id",
      dataIndex: "id",
      key: "id",
      sorter: (a: BookingData, b: BookingData) => a.id - b.id,
    },
    {
      title: "Booking Referance",
      dataIndex: "booking_reference",
      key: "booking_reference",
      sorter: (a: BookingData, b: BookingData) =>
        a.booking_reference.localeCompare(b.booking_reference),
    },
    {
      title: "Type",
      dataIndex: "content_type",
      key: "content_type",
      sorter: (a: BookingData, b: BookingData) =>
        a.content_type.localeCompare(b.content_type),
    },
    {
      title: "Created At",
      key: "created_at",
      sorter: (a: BookingData, b: BookingData) =>
        new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),

      render: (record: BookingData) => {
        const createdAt = new Date(record.created_at);
        if (isNaN(createdAt.getTime())) {
          return <span>Invalid Date</span>;
        }
        return <span>{createdAt.toISOString().split("T")[0]}</span>;
      },
    },

    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      sorter: (a: BookingData, b: BookingData) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      sorter: (a: BookingData, b: BookingData) =>
        new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
    },
    {
      title: "Price ($)",
      key: "total_price",
      sorter: (a: BookingData, b: BookingData) =>
        Number(a.total_price) - Number(b.total_price),
      render: (record: BookingData) => {
        return <span>{Number(record.total_price).toLocaleString()}</span>;
      },
    },
    { title: "Guest", dataIndex: "guests", key: "guests" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: BookingData) =>
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
    {
      title: "Payment Status",
      key: "payment_status",

      sorter: (a: BookingData, b: BookingData) =>
        a.status.localeCompare(b.status),
      render: (data: BookingData) => {
        return (
          <button
            className={`${
              data.payment_status === "pending"
                ? " text-yellow-400"
                : data.payment_status === "confirmed"
                ? "text-green-400"
                : " text-red-400"
            } p-2 rounded-lg capitalize font-semibold`}
            disabled={data.status !== "confirmed"}
          >
            {data.payment_status ? data.payment_status : "Not paid"}
          </button>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: BookingData) => (
        <span className="flex space-x-2">
          <Button
            type="link"
            onClick={() =>
              handleView(record.object_id, record.content_type, record.id)
            }
            icon={<Icon icon="mdi:eye" />}
            className="!text-stone-500 !font-bold"
          >
            View
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this booking?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
              type: "primary",
            }}
            cancelButtonProps={{
              style: { color: "#dc2626" },
            }}
          >
            <Button
              type="link"
              danger
              icon={<Icon icon="mdi:delete" />}
              className=" !font-bold"
            >
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 min-h-screen px-4">
      <Title name="Booking List" icon="material-symbols:book" />

      {/* Search Bar */}
      <div className="flex flex-col w-full md:w-2/3 md:flex-row md:items-center justify-between gap-4 bg-white p-4 shadow-md rounded-md">
        <Search
          placeholder="Search by ID, Booking reference or Type..."
          allowClear
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          className="w-full md:w-1/3"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="w-full md:w-1/2 self-center h-full md:h-1/2 border flex flex-col items-center justify-center rounded-md p-6">
          <Icon
            icon="arcticons:triple-a"
            width="80"
            height="80"
            className="text-primaryGreen"
          />
          <span className="font-bold text-lg mt-4">No Bookings Yet</span>
          <span className="text-sm text-slate-500 text-center mt-2">
            Once a user books a service, their booking details will appear here.
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={[...filteredBookings]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            rowKey="id"
            pagination={false}
            className="w-full"
            expandable={{
              expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
              expandedRowRender: (record: BookingData) => (
                <div className="p-4 bg-gray-100 rounded-md">
                  <p>
                    <strong>Traveler Name:</strong> {record.user.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {record.user.email}
                  </p>
                  <p>
                    <strong>Notes:</strong>{" "}
                    {record.note || "No additional notes."}
                  </p>
                </div>
              ),
              rowExpandable: (record) => true,
            }}
          />
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredBookings.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsTable;

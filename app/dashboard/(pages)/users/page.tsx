"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Popconfirm,
  Space,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import { getUser, User } from "@/app/api/user/action";

const { Title } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  const fetchUsers = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const result = await getUser();
      if (result.status === "success") {
        const customers = result.data.filter(
          (user: User) => user.role === "customer"
        );
        setUsers(customers);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: customers.length,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };
  const handleView = (user: User) => {
    message.info(`View user: ${user.full_name}`);
    // You can redirect to a detail page or open a modal here
  };

  const handleDelete = (user: User) => {
    message.success(`Deleted user: ${user.full_name}`);
    // You can call your delete API here
  };

  const columns: ColumnsType<User> = [
    {
      title: "#",

      responsive: ["xs", "sm", "md", "lg"],
      render: (_: any, __: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md", "lg"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md", "lg"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color =
          role === "admin"
            ? "red"
            : role === "service_provider"
            ? "blue"
            : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleView(record)}
            className="text-blue-600"
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <ServiceProviderTemplate>
      <div className="p-6">
        <Title level={3} className="mb-4">
          Customer List
        </Title>
        <Table
          columns={columns}
          dataSource={users}
          rowKey={(record) => record.id.toString()}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
        />
      </div>
    </ServiceProviderTemplate>
  );
};

export default UsersPage;

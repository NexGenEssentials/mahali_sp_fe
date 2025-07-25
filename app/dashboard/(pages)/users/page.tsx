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
import {
  ChangerUserRole,
  DeleteUser,
  getUser,
  User,
} from "@/app/api/user/action";

const { Title } = Typography;
const tabs = ["Users", "Agents"];

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [active, setActive] = useState("Users");

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
        const agentsList = result.data.filter(
          (user: User) => user.role === "agent"
        );
        setUsers(customers);
        setAgents(agentsList);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: active === "Users" ? customers.length : agentsList.length,
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

  const handleView = async (user: User) => {
    const result = await ChangerUserRole(user.id);
    if (result.status === "success") {
      message.info(`User Role changed successfully`);
      fetchUsers(pagination.current, pagination.pageSize);
    } else {
      message.warning(`Something went wrong`);
    }
  };

  const handleDelete = async (user: User) => {
    try {
      const result = await DeleteUser(user.id);
      if (result) {
        message.success(`Deleted user: ${user.full_name}`);
        setUsers((prev) => prev.filter((client) => client.id !== user.id));
      }
    } catch (error) {
      message.error(`something went wrong`);
    }
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
      align: "center",
      key: "actions",
      render: (_text, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to change this user's role?"
            onConfirm={() => handleView(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" className="text-green-600 hover:underline">
              Change to Agent
            </Button>
          </Popconfirm>
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
      <div className="border-b border-gray-200  gap-8 flex items-center justify-center ">
        {tabs.map((tab) => (
          <div
            onClick={() => setActive(tab)}
            className={`${
              active === tab
                ? "font-bold text-gray-800 border-b-2 bg-primaryGreen/10 px-4 py-1 rounded-lg border-primaryGreen w-fit"
                : "text-gray-400"
            } cursor-pointer `}
            key={tab}
          >
            {tab}
          </div>
        ))}
      </div>

      {active === "Users" && (
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
      )}

      {active === "Agents" && (
        <div className="p-6">
          <Title level={3} className="mb-4">
            Agents List
          </Title>
          <Table
            columns={columns}
            dataSource={agents}
            rowKey={(record) => record.id.toString()}
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
          />
        </div>
      )}
    </ServiceProviderTemplate>
  );
};

export default UsersPage;

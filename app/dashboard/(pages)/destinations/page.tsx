"use client";

import React, { useEffect, useState } from "react";
import { Table, Modal, Spin, Tooltip, Space, message, Image } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import { DeleteCountry, getAllCountry } from "@/app/api/destinations/action";
import { CountryType } from "@/app/types/service/tour";
import Link from "next/link";
import { motion } from "framer-motion";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

const DestinationPage = () => {
  const [destinations, setDestinations] = useState<CountryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDestination, setSelectedDestination] =
    useState<CountryType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    handleGetCountry();
  }, []);

  const handleView = (record: CountryType) => {
    setSelectedDestination(record);
    setIsModalVisible(true);
  };

  const handleEdit = (record: CountryType) => {
    message.info(`Edit destination: ${record.name}`);
  };

  const handleDelete = async (record: CountryType) => {
    Modal.confirm({
      title: `Are you sure you want to delete "${record.name}"?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        const result = await DeleteCountry(record.id);
        if (result) {
          setDestinations((prev) =>
            prev.filter((dest) => dest.id !== record.id)
          );
          message.success("Destination deleted");
        }
      },
    });
  };

  const handleGetCountry = async () => {
    try {
      const result = await getAllCountry();
      if (result.success) {
        setDestinations(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignHighlight = (id: number) => {
    router.push(`/dashboard/destinations/assign/${id}`);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Image src={image} alt="Country" width={80} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: CountryType) => (
        <Space size="middle">
          <button
            onClick={() => handleAssignHighlight(record.id)}
            className="text-indigo-600 hover:text-indigo-800 hover:underline duration-200 transition"
            title="Assign highlight"
          >
            Assign highlight
          </button>
          <Tooltip title="View Details">
            <EyeOutlined
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlined
              style={{ color: "#52c41a", cursor: "pointer" }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              style={{ color: "#ff4d4f", cursor: "pointer" }}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandable = {
    expandedRowRender: (record: CountryType) => (
      <div className="space-y-4 bg-gray-100 p-8 rounded">
        <div>
          <strong>Full Description:</strong>
          <p>{record.description}</p>
        </div>

        <div>
          <strong>Highlights:</strong>
          <ul className="list-disc list-inside">
            {record.highlights?.map((hl, index) => (
              <li key={index}>
                <strong>{hl.title}:</strong> {hl.description}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <strong>When to Go:</strong>
          <ul className="list-disc list-inside">
            {record.when_to_go?.map((season) => (
              <li key={season.id}>
                <strong>{season.season}</strong> ({season.start_month} -{" "}
                {season.end_month}): {season.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
    rowExpandable: (record: CountryType) => !!record.description,
  };

  return (
    <ServiceProviderTemplate>
      <div className="p-4">
        <div className="flex justify-between gap-4 w-full px-4 mb-8">
          <h1 className="text-2xl font-semibold mb-4">All Destinations</h1>
          <Link href="/dashboard/destinations/country">
            <motion.span
              whileHover={{ scale: 0.9 }}
              className="p-3 rounded-md text-white hover:bg-primaryGreen bg-primaryGreen/70 cursor-pointer font-bold flex gap-2"
            >
              Create Destinations <SquarePen />
            </motion.span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={destinations}
            columns={columns}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
            expandable={expandable}
          />
        )}
        <Modal
          title={selectedDestination?.name}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          className="!w-full !container"
        >
          {selectedDestination && (
            <>
              <Image
                src={selectedDestination.image}
                alt="Country"
                width={300}
                className="mb-4"
              />
              <p>
                <strong>Description:</strong> {selectedDestination.description}
              </p>
              <h3 className="mt-4 font-semibold">Highlights</h3>
              <ul className="list-disc list-inside">
                {selectedDestination.highlights.map((hl, index) => (
                  <li key={index}>
                    <strong>{hl.title}:</strong> {hl.description}
                  </li>
                ))}
              </ul>
              <h3 className="mt-4 font-semibold">Best Seasons to Visit</h3>
              <ul className="list-disc list-inside">
                {selectedDestination.when_to_go.map((w) => (
                  <li key={w.id}>
                    <strong>{w.season}</strong> ({w.start_month} - {w.end_month}
                    ): {w.description}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal>
      </div>
    </ServiceProviderTemplate>
  );
};

export default DestinationPage;

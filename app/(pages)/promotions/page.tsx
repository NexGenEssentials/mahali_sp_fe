"use client";

import { useEffect, useState } from "react";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import { Adstype, EditAdvert, getAdvert } from "@/app/api/booking/action";
import { Input, Button, Spin, message, Card, Typography } from "antd";

const { TextArea } = Input;
const { Title, Text } = Typography;

const PromotionPage = () => {
  const [loading, setLoading] = useState(true);
  const [advert, setAdvert] = useState<Adstype>({
    id: 0,
    description: "",
    url: "",
    updated_at: "",
  });

  const [formData, setFormData] = useState({
    description: "",
    url: "",
  });

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    handleGetAdvert();
  }, []);

  const handleGetAdvert = async () => {
    try {
      const result = await getAdvert();
      if (result.status === "success") {
        setAdvert(result.data);
        setFormData({
          description: result.data.description,
          url: result.data.url,
        });
      }
    } catch (error) {
      message.error("Failed to fetch advert data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdvert = async () => {
    setUpdating(true);
    try {
      const result = await EditAdvert({
        description: formData.description,
        url: formData.url,
      });
      if (result.status === "success") {
        message.success("Advert updated successfully!");
        setAdvert(result.data);
      }
    } catch (error) {
      message.error("Failed to update advert");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ServiceProviderTemplate>
      <div className="p-6 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <Card
            title={<Title level={4}>Current Promotion</Title>}
            bordered={false}
            className="shadow-md"
          >
            <div className="space-y-4">
              <div>
                <Text strong>Description</Text>
                <TextArea
                  rows={4}
                  value={formData.description}
                  className="input"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter advert description"
                />
              </div>
              <div>
                <Text strong>Promotion URL</Text>
                <Input
                  className="input"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://yourpromo.com"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  className="!bg-primaryGreen !font-bold !text-white !p-4"
                  onClick={handleUpdateAdvert}
                  loading={updating}
                >
                  Update Advert
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ServiceProviderTemplate>
  );
};

export default PromotionPage;

"use client";
import { getMessages, Message } from "@/app/api/user/action";
import Loader from "@/app/components/skeleton/loader";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React, { useEffect, useState } from "react";

const ContactUsTable = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetMessage();
  });

  const toggleSeenStatus = (index: number) => {
    const updated = [...messages];
    updated[index].seen = !updated[index].seen;
    setMessages(updated);
  };

  const handleGetMessage = async () => {
    try {
      const result = await getMessages();
      console.log("Messages:", result);
      if (result.status) {
        setMessages(result.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceProviderTemplate>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Contact Us Messages</h2>
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Message</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.length <= 0 ? (
                  <tr className="h-96">
                    <td colSpan={5} className="text-center font-bold text-2xl">No Messages Available</td>
                  </tr>
                ) : (
                  messages.map((msg, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-3">{msg.email}</td>
                      <td className="px-4 py-3">{msg.full_name}</td>
                      <td className="px-4 py-3">{msg.message}</td>
                      <td className="px-4 py-3">{msg.phone}</td>
                      <td className="px-4 py-3 flex items-center space-x-3">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            msg.seen ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <button
                          onClick={() => toggleSeenStatus(idx)}
                          className={`px-4 py-2 border rounded  font-medium ${
                            msg.seen
                              ? "bg-white text-black"
                              : "bg-black hover:bg-gray-800 text-white"
                          }`}
                        >
                          {msg.seen ? "Mark as Unseen" : "Mark as Seen"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ServiceProviderTemplate>
  );
};

export default ContactUsTable;

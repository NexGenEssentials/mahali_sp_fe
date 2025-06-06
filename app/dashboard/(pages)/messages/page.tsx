"use client";
import { getMessages, Message } from "@/app/api/user/action";
import Loader from "@/app/components/skeleton/loader";
import ServiceProviderTemplate from "@/app/dashboard/serviceProviderTemplate";
import React, { useEffect, useState } from "react";

const MESSAGES_PER_PAGE = 5;

const ContactUsTable = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    handleGetMessage();
  }, []);

  const toggleSeenStatus = (index: number) => {
    const globalIndex = (currentPage - 1) * MESSAGES_PER_PAGE + index;
    const updated = [...messages];
    updated[globalIndex].seen = !updated[globalIndex].seen;
    setMessages(updated);
  };

  const handleGetMessage = async () => {
    try {
      const result = await getMessages();
      if (result.status) {
        setMessages(
          result.data.map((message: Message) => ({ ...message, seen: false }))
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);
  const paginatedMessages = messages.slice(
    (currentPage - 1) * MESSAGES_PER_PAGE,
    currentPage * MESSAGES_PER_PAGE
  );

  return (
    <ServiceProviderTemplate>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Contact Us Messages</h2>
        <div className="overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <>
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-600">
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Message</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMessages.length <= 0 ? (
                    <tr className="h-96">
                      <td
                        colSpan={5}
                        className="text-center font-bold text-2xl"
                      >
                        No Messages Available
                      </td>
                    </tr>
                  ) : (
                    paginatedMessages.map((msg, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3">{msg.email}</td>
                        <td className="px-4 py-3">{msg.full_name}</td>
                        <td className="px-4 py-3">{msg.message}</td>
                        <td className="px-4 py-3 flex items-center space-x-3">
                          <span
                            className={`h-3 w-3 rounded-full ${
                              msg.seen ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <button
                            onClick={() => toggleSeenStatus(idx)}
                            className={`px-4 py-2 border rounded font-medium ${
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ServiceProviderTemplate>
  );
};

export default ContactUsTable;

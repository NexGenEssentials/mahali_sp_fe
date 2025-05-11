"use client";

import {
  FaMoneyBillWave,
  FaBookOpen,
  FaCrown,
  FaWallet,
  FaHandHoldingUsd,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const analyticsData = {
  totalAmount: "RWF 2,000,000",
  totalBookings: 350,
  topService: "Safari Adventure",
  currentBalance: "RWF 500,000",
  withdrawals: "RWF 1,500,000",
};

const chartData = [
  { date: "Jan", amount: 2000 },
  { date: "Feb", amount: 4000 },
  { date: "Mar", amount: 8000 },
  { date: "Apr", amount: 6.0 },
  { date: "May", amount: 1000 },
];

const tableData = [
  {
    id: 1,
    service: "Safari Adventure",
    amount: "RWF 100,000",
    date: "2025-04-15",
  },
  { id: 2, service: "City Tour", amount: "RWF 150,000", date: "2025-04-16" },
  {
    id: 3,
    service: "Gorilla Trekking",
    amount: "RWF 200,000",
    date: "2025-04-17",
  },
];

const cardStyle = "bg-white shadow p-4 rounded-lg flex items-center gap-4";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
        <p>This is your dashboard.</p>
      </div>
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className={cardStyle}>
          <FaMoneyBillWave className="text-green-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Total Earned</p>
            <h2 className="text-lg font-bold">{analyticsData.totalAmount}</h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaBookOpen className="text-blue-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Bookings</p>
            <h2 className="text-lg font-bold">{analyticsData.totalBookings}</h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaCrown className="text-yellow-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Top Service</p>
            <h2 className="text-lg font-bold">{analyticsData.topService}</h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaWallet className="text-purple-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <h2 className="text-lg font-bold">
              {analyticsData.currentBalance}
            </h2>
          </div>
        </div>
        <div className={cardStyle}>
          <FaHandHoldingUsd className="text-red-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Withdrawals</p>
            <h2 className="text-lg font-bold">{analyticsData.withdrawals}</h2>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Total Amount Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <table className="w-full table-auto text-left">
          <thead className="border-b">
            <tr>
              <th className="py-2">Service</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{row.service}</td>
                <td className="py-2">{row.amount}</td>
                <td className="py-2">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

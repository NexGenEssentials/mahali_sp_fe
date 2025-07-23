"use client";
import { useEffect } from "react";
import {
  FaChartBar,
  FaUserCircle,
  FaServicestack,
  FaAngleRight,
  FaAngleLeft,
  FaUser,
  FaUsersCog,
  FaTags,
  FaMapMarkedAlt,
  FaEnvelope,
  FaClipboardList,
} from "react-icons/fa";
import { useAppContext } from "../context";
import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { Logout } from "../helpers/isUserLogedIn";

const commonItems = [
  {
    name: "Analytics",
    icon: FaChartBar,
    link: "",
  },
  {
    name: "Register Account",
    icon: FaUserCircle,
    link: "account",
  },
  {
    name: "Service",
    icon: FaServicestack,
    link: "service",
  },
  {
    name: "Booking",
    icon: FaClipboardList,
    link: "booking",
  },
  // {
  //   name: "Payments",
  //   icon: FaMoneyCheckAlt,
  // },
];

const AdminItems = [
  {
    name: "Users",
    icon: FaUser,
    link: "users",
  },
  {
    name: "Service Providers",
    icon: FaUsersCog,
    link: "service_providers",
  },
  {
    name: "Promotions",
    icon: FaTags,
    link: "promotions",
  },
  {
    name: "Destinations",
    icon: FaMapMarkedAlt,
    link: "destinations",
  },

  {
    name: "Contact Messages",
    icon: FaEnvelope,
    link: "messages",
  },

  {
    name: "Bulk Bookings",
    icon: FaClipboardList,
    link: "bulk",
  },
];

export default function Sidebar() {
  const { expanded, setExpanded, userRole } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (tabName: string) => {
    setExpanded(true);
    if (tabName === "Analytics") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/${tabName.toLowerCase()}`);
    }
  };

  const handleLogout = () => {
    Logout();
    router.push("/");
  };

  const SidebarItems =
    userRole === "admin" ? [...commonItems, ...AdminItems] : commonItems;

  return (
    <div
      className={`h-screen fixed bg-gray-50 shadow-md transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <span className={`${expanded ? "block" : "hidden"} text-xl font-bold`}>
          Mahali Africa Advanture
        </span>
        {expanded && (
          <div className="bg-green-300 p-2 rounded-md">
            <FaAngleLeft
              onClick={() => setExpanded(false)}
              className="cursor-pointer  text-slate-900"
            />
          </div>
        )}
        {!expanded && (
          <div className="bg-green-300 p-2 rounded-md">
            <FaAngleRight
              onClick={() => setExpanded(true)}
              className="cursor-pointer text-slate-900"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between h-[85%]">
        <ul className="mt-4 space-y-4 px-4">
          {SidebarItems.map((item, index) => {
            const active = pathname.includes(item.link);
            return (
              <li
                onClick={() =>
                  handleTabClick(item.link ? item.link : item.name)
                }
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-100 ${
                  active
                    ? "bg-green-100 text-slate-700 font-bold shadow-md"
                    : "text-slate-500"
                } ${
                  expanded
                    ? "justify-start hover:bg-green-200"
                    : "justify-center"
                }`}
                key={index}
              >
                {React.createElement(item.icon, {
                  className: `${
                    active ? "text-slate-700 text-lg" : "text-slate-500"
                  } cursor-pointer`,
                })}
                {expanded && <span>{item.name}</span>}
              </li>
            );
          })}
        </ul>
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-green-200 cursor-pointer mx-4 mt-4"
        >
          <AiOutlineLogout className="cursor-pointer text-slate-900" />
          {expanded && <h2>Logout </h2>}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { User, getUser, getUserProfile } from "../api/user/action";
import { Avatar, Dropdown, Menu } from "antd";

export default function Topbar() {
  const [user, setUser] = useState<User>({
    id: 0,
    full_name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    handleGetuser();
  }, []);

  const handleGetuser = async () => {
    // const resulti = await getUser();
    const result = await getUserProfile();
    if (result) {
      setUser(result);
    }
  };

  const userInitial = user.full_name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="sticky top-0 left-0 right-0 h-16 z-50 bg-white bg-prim shadow-sm flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">
        Dashboard Overview
      </h1>

      <div className="flex items-center gap-3 cursor-pointer">
        <Avatar
          style={{
            backgroundColor: "#667c3e",
            verticalAlign: "middle",
          }}
          size="large"
        >
          {userInitial}
        </Avatar>
        <div className="hidden md:flex flex-col">
          <span className="font-medium text-sm text-gray-800">
            {user.full_name}
          </span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </div>
    </div>
  );
}

'use client'
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React from "react";

function GobackButton() {
  const router = useRouter();
  return (
    <div className="w-full border-b pb-2">
      <div
        onClick={() => router.back()}
        className="text-lg font-bold text-slate-400 hover:text-primaryGreen hover:duration-500 transition w-fit flex items-center gap-2 cursor-pointer"
      >
        <Icon icon="ion:arrow-back" width="25" height="25" />
        <span>Go Back</span>
      </div>
    </div>
  );
}

export default GobackButton;

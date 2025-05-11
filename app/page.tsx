"use client";
import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import SignInForm from "./components/form/signinForm";
import Logo from "./components/logo";
import ButtonComponent from "./components/buttons/buttonIcon";

const Signin = () => {
  const size = "small";
  const year = new Date().getFullYear();
  const router = useRouter();
  return (
    <section className="bg-slate-100 w-full py-8 min-h-[calc(100vh)] flex items-center justify-center">
      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <div className="w-[90%] md:w-3/4 lg:w-2/3 xl:w-1/2 rounded-2xl bg-white flex flex-row shadow-md ">
          <div className="max-sm:hidden w-1/2 rounded-s-2xl bg-[#F4F5F6] flex flex-col justify-between p-8">
            <Logo />
            <div>
              <h1
                className={`${
                  size === "small" ? "text-base" : "text-2xl"
                } font-extrabold  text-primaryGreen`}
              >
                Mahali Africa <br /> Adventure
              </h1>
            </div>
            <span className="text-primaryBlue text-xs text-opacity-40">
              © {year} Mahali Africa
            </span>
          </div>
          <div className="max-sm:w-full w-1/2 p-8 flex flex-col">
            <h1 className="text-primaryGreen font-extrabold text-2xl mb-5">
              Login
            </h1>
            <SignInForm />
          </div>
        </div>
        <div className="w-[90%] md:w-3/4 lg:w-2/3 xl:w-1/2 p-8 bg-white rounded-2xl flex justify-between items-center flex-wrap gap-4 shadow-md">
          <div className="flex flex-col gap-2">
            <span className="text-primaryGreen font-bold text-sm">
              New Here?
            </span>
            <span className="text-primaryBlue text-xs">Create an account</span>
          </div>
          <ButtonComponent
            title="Register here"
            color=""
            link="/signup"
            icon={
              <ArrowRightOutlined className="text-green-800 group-hover:!text-white !font-bold" />
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Signin;

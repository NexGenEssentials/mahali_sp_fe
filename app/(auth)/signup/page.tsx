"use client"
import React from "react";
import { LoginOutlined } from "@ant-design/icons";
import SignupForm from "./form";
import Logo from "@/app/components/logo";
import ButtonComponent from "@/app/components/buttons/buttonIcon";


const Signup = () => {
  return (
    <section className="bg-slate-100 w-full h-full min-h-[calc(100vh)] p-2 sm:p-8 flex items-center justify-center">
      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <div className="w-full sm:w-[90%] md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-screen-lg rounded-2xl bg-white flex flex-row shadow-md">
          <div className="w-full px-4 sm:px-8 py-4 flex flex-col">
            <div className="flex gap-8 px-2 sm:px-8 pb-2 items-center justify-between w-ful">
              <Logo />
              <h1 className="w-ful md:w-3/5 text-primaryGreen font-extrabold text-2xl self-center ">
                Register
              </h1>
            </div>
            <SignupForm />
          </div>
        </div>
        <div className="w-full sm:w-[90%] md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-screen-lg p-4 sm:p-8 bg-white rounded-2xl flex justify-between items-center flex-wrap gap-4 shadow-md">
          <div className="flex flex-col gap-2">
            <span className="text-textTitlesColor font-bold text-sm">
              Already have an account ?
            </span>
            <span className="text-textSubTitlesColor text-xs">Go to login</span>
          </div>
          <ButtonComponent
            title="Login"
            color=""
            link="/"
            icon={<LoginOutlined className="text-textDefaultGreen font-bold" />}
          />
        </div>
      </div>
    </section>
  );
};
export default Signup;

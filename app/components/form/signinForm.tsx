"use client";
import React, { useState } from "react";
import { LockOutlined, LoginOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export interface SigninFormData {
  email: string;
  password: string;
}

const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const onFinish = async (values: SigninFormData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        notification.success({
          message: "Login",
          description: data.message,
          placement: "topRight",
          duration: 1.5,
        });

        setTimeout(() => {
          route.push(callbackUrl);
        }, 1500);
      } else {
        notification.error({
          message: data.error,
          description: data.description,
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Submission Failed",
        description: "Oops something went wrong !!",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = () => {
    notification.error({
      message: "Form Errors",
      description:
        "Kindly correct the highlighted errors in the form and try again.",
      placement: "topRight",
    });
  };

  return (
    <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
        ]}
      >
        <Input
          type="email"
          allowClear
          placeholder="Enter email"
          prefix={
            <MailOutlined className="site-form-item-icon pl-1 pr-2 text-primaryGreen" />
          }
          className=" !bg-opacity-[4%] hover:!border-primaryGreen !text-xs !py-3"
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password
          placeholder="Enter password"
          prefix={
            <LockOutlined className="site-form-item-icon pl-1 pr-2 text-primaryGreen" />
          }
          className=" !bg-opacity-[4%] hover:!border-primaryGreen !text-xs !py-3"
        />
      </Form.Item>
      <div className="mt-6 flex justify-between flex-wrap space-y-4 items-center">
        <Link href={"/forget-password"}>
          <span className="underline  text-primaryGreen font-bold cursor-pointer hover:opacity-60">
            Forget Password ?
          </span>
        </Link>
        <Form.Item>
          <Button
            loading={loading}
            htmlType="submit"
            className=" !shadow-md !border-0 hover:!bg-primaryGreen hover:!text-white rounded-md !text-primaryGreen !p-5 !font-extrabold !text-sm"
          >
            Login
            <LoginOutlined />
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default SignInForm;

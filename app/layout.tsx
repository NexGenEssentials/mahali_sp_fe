import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "./context";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Mahali Africa Adventures",
  description: "Tour and travel agency working from Rwanda",
  icons: {
    icon: "/images/logoWhite.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <ContextProvider>
          <AntdRegistry>
            <div>
              <Sidebar />
              <div className={`pl-64 mx-4`}>
                <Topbar />
              </div>
                {children}
            </div>
          </AntdRegistry>
        </ContextProvider>
      </body>
    </html>
  );
}

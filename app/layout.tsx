import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "./context";
import { AntdRegistry } from "@ant-design/nextjs-registry";


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
          <AntdRegistry>{children}</AntdRegistry>
        </ContextProvider>
      </body>
    </html>
  );
}

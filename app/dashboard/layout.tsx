'use client'
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAppContext } from "../context";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      const { expanded } = useAppContext();
  return (
    <div>
      <Sidebar />
      <div className={`${expanded ? "pl-64" : "pl-20"} mx-4`}>
        <Topbar />
      </div>
      {children}
    </div>
  );
}

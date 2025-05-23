"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";

interface ContextValue {
  openNavDiscount: boolean;
  setOpenNavDiscount: (openNavDiscount: boolean) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  activeModalId: string | null;
  setActiveModalId: (id: string | null) => void;
  userRole: string;
  setUserRole: (value: string) => void;
}

const AppContext = createContext<ContextValue>({} as ContextValue);

function ContextProvider({ children }: PropsWithChildren) {
  const [openNavDiscount, setOpenNavDiscount] = useState<boolean>(true);
  const [expanded, setExpanded] = useState(true);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop() || "Analytics";
  const [activeTab, setActiveTab] = useState(currentPath);

  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        openNavDiscount,
        setOpenNavDiscount,
        expanded,
        setExpanded,
        activeTab,
        setActiveTab,
        activeModalId,
        setActiveModalId,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
export default ContextProvider;

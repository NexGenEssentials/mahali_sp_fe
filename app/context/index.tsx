"use client";
import { usePathname } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
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
  userRole: string | null;
  setUserRole: (value: string | null) => void;
}

const AppContext = createContext<ContextValue>({} as ContextValue);

function ContextProvider({ children }: PropsWithChildren) {
  const [openNavDiscount, setOpenNavDiscount] = useState<boolean>(true);
  const [expanded, setExpanded] = useState(true);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop() || "Analytics";
  const [activeTab, setActiveTab] = useState(currentPath);
  const [userRole, setUserRole]=useState<string|null>(null)

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

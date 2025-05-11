"use client";
import { useAppContext } from "@/app/context";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ReactNode } from "react";

const RightModal = ({children, id,}: {children: ReactNode; id: string | null | undefined;}) => {
  const { activeModalId, setActiveModalId } = useAppContext();

  const closeModal = () => {
    if (id !== "not-found") {
      setActiveModalId(null);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={`${activeModalId ? "block absolute" : "hidden"}`}>
      {activeModalId === id && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-end max-md:items-end items-center z-50"
          onClick={closeModal}
        >
          <div
            className={`bg-white h-screen w-full md:w-3/4 lg:w-1/2 rounded-l-lg shadow-lg p-4 overflow-y-scroll hide-scrollbar transform transition-all duration-500 ease-out `}
            onClick={handleModalClick}
          >
            {id !== "not-found" && (
              <div className="text-end w-full flex items-end justify-end">
                <Icon
                  onClick={closeModal}
                  height={25}
                  width={25}
                  icon="jam:close"
                  color="#3f6db0"
                />
              </div>
            )}
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightModal;

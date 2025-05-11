import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`
        "bg-white rounded-xl shadow-sm border border-gray-200  overflow-hidden",
       ${ className}
     ` }
    >
      {children}
    </div>
  );
};

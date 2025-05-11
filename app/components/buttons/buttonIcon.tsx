import { Button } from "antd";
import { ReactNode } from "react";

interface Props {
  title: string;
  color: string;
  link?: string;
  icon: ReactNode;
  iconPosition?: string;
}
const ButtonComponent = (params: Props) => {
  const { title, link, icon, iconPosition } = params;
  return (
    <Button
      htmlType="submit"
      href={link}
      className='group hover:!bg-primaryGreen hover:!text-white !shadow-md !border-none rounded-lg !text-primaryGreen !p-5 !font-extrabold !text-sm '
    >
      {iconPosition === "left" && icon}
      {title}
      {iconPosition !== "left" && icon}
    </Button>
  );
};

export default ButtonComponent;

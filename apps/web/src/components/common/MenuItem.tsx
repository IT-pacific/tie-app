import { cn } from "@/utils/tw-merge";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
interface Props {
  to: string;
  icon: ReactNode;
  name: string;
}
const MenuItem = ({ to, icon, name }: Props) => {
  const location = useLocation();
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1 w-full py-4 px-2 pl-5 border-l-4",
        location.pathname === to ? "bg-gradient-to-tr from-[#1a4082] to-[#243563] border-l-white" : "bg-inherit border-l-transparent"
      )}
    >
      <div
        className={`text-xl text-white`}
      >
        {icon}
      </div>
      <span className={`ml-1 transition-all text-white text-sm`}>{name}</span>
    </Link>
  );
};

export default MenuItem;

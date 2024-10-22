import React from "react";
import { GoDotFill } from "react-icons/go";

type Props = {
  status: string;
  color: string;
};
const Stat = ({ status, color }: Props) => {
  return (
    <div className="flex items-center gap-[2px]">
      <GoDotFill fontSize={24} className={color} />
      <h2 className="text-xs capitalize text-[#d0d0d0]">{status}</h2>
    </div>
  );
};

export default Stat;

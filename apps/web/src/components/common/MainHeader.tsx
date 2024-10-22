import React from "react";

type Props = {
  heading: string;
};
const MainHeader = ({ heading }: Props) => {
  return <h2 className="text-lg text-black font-medium capitalize">{heading}</h2>;
};

export default MainHeader;

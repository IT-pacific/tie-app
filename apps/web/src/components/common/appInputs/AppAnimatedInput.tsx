import React, {
  HTMLInputTypeAttribute,
  useState,
} from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  type: HTMLInputTypeAttribute;
  label: string;
}

const AppAnimatedInput: React.FC<Props> = ({ type, label, ...otherProps }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <div>
      <label
        htmlFor={label}
        className="flex items-center text-sm capitalize mb-0.5"
      >
        {label}
      </label>
      <div className="relative group">
        <Input
        tabIndex={-1}
          type={showPassword ? "text" : type}
          id={label}
          required
          className="w-full h-10 text-sm outline-none border-[#BDBDBD] focus-within:border-[#918EF4]"
          {...otherProps}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute  right-0 top-[21%] mr-4"
            onClick={togglePasswordVisibility}
          >
            <Icon
              color="#BEBEBE"
              fontSize={24}
              icon={showPassword ? "tabler:eye" : "humbleicons:eye-off"}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default AppAnimatedInput;

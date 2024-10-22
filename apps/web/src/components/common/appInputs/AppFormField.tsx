import React from "react";
import { useFormikContext } from "formik";
import AppAnimatedInput from "./AppAnimatedInput";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type: string;
}

const AppFormField: React.FC<Props> = ({ name, type, ...otherProps }) => {
  const { setFieldTouched, setFieldValue, values } =
    useFormikContext<Record<string, string>>();
  return (
    <div>
      <AppAnimatedInput
        
        label={name}
        type={type}
        {...otherProps}
        onBlur={() => setFieldTouched(name)}
        onChange={(e) => setFieldValue(name, e.target.value)}
        defaultValue={values[name]}
      />
    </div>
  );
};

export default AppFormField;

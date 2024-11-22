import React from "react";

const MyInput = ({ error, ...props }, ref) => {
  let classes = "border  bg-white rounded-sm p-2 shadow-sm";

  if (error) classes += " border-red-300";
  else classes += " border-grey-300";

  return <input className={classes} {...props} ref={ref} />;
};

const Input = React.forwardRef(MyInput);

export default Input;

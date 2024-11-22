import classNames from "classnames";

const Button = ({
  size = "medium",
  variation = "primary",
  children,
  ...props
}) => {
  const sizeClasses = {
    small: "text-xs py-1 px-2 uppercase font-semibold text-center",
    medium: "text-sm py-3 px-4 font-medium",
    large: "text-base py-3 px-6 font-medium",
  };

  const variationClasses = {
    primary:
      " text-zinc-100 bg-indigo-900 hover:bg-indigo-950 hover:text-zinc-50",
    secondary:
      " text-indigo-900  bg-slate-200 border border-gray-200 hover:bg-slate-300",
    danger: "text-red-100 bg-red-700 hover:bg-red-800",
    tertiary: "text-zinc-100 bg-green-700 hover:bg-green-800",
  };

  const classes = classNames(
    "border-none rounded-sm shadow-sm",
    sizeClasses[size],
    variationClasses[variation]
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;

const Form = ({ type = "regular", children, ...props }) => {
  const baseClasses = "overflow-hidden text-sm"; // Tailwind's text-sm is 1.4rem

  const regularClasses = "p-6 bg-white border border-gray-200 rounded-md";
  const modalClasses = "w-[80rem]";

  const classes = `${baseClasses} ${type !== "regular" ? regularClasses : ""} ${
    type === "modal" ? modalClasses : ""
  }`;

  return (
    <form className={classes} {...props}>
      {children}
    </form>
  );
};

export default Form;

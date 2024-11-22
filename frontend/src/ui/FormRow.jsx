const FormRow = ({ label, error, children, orientation }) => {
  const baseClasses = "grid items-center py-3";
  const horizontalClasses =
    "md:grid-cols-[5fr_auto_1.2fr] md:grid-flow-row grid-cols-[1fr] grid-flow-col gap-6 border-b border-gray-100";
  const verticalClasses = "gap-2";

  const classes = `${baseClasses} ${
    orientation === "vertical" ? verticalClasses : horizontalClasses
  }`;

  return (
    <div className={classes}>
      {label && (
        <label
          className="font-medium"
          htmlFor={children.props.id || children.props.name}
        >
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-red-700 text-sm">{error}</span>}
    </div>
  );
};

export default FormRow;

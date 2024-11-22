function Tag({ type, children }) {
  let classes =
    "uppercase text-sm px-2 py-1 md:px-5 md:py-2 w-fit font-medium rounded-full";

  if (type === "red") classes += ` text-red-800 bg-red-100`;
  if (type === "green") classes += ` text-green-800 bg-green-100`;

  return <span className={classes}>{children}</span>;
}

export default Tag;

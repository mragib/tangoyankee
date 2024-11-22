import { formatCurrency } from "@/util";
import { FaEquals, FaMinus, FaPlus } from "react-icons/fa6";

function Stat({ gl }) {
  const { gl_type, totalDebitAmount, totalCreditAmount } = gl;

  let baseClasses =
    "p-3 grid grid-cols-[1fr_.5fr]  border border-1  border-[#f3f4f6] dark:border-[#1f2937]  rounded-lg";
  let textColor = "text-title-lg uppercase self-end";
  if (gl_type === "Asset") {
    baseClasses += " bg-green-200";
    textColor += " text-green-800";
  } else if (gl_type === "Expense") {
    baseClasses += " bg-red-100";
    textColor += " text-red-800";
  } else if (gl_type === "Equity") {
    baseClasses += " bg-amber-100";
    textColor += " text-amber-800";
  } else if (gl_type === "Liability") {
    textColor += " text-cyan-800";
    baseClasses += " bg-cyan-100";
  } else if (gl_type === "Revenue") {
    baseClasses += " bg-lime-100";
    textColor += " text-lime-800";
  }
  return (
    <div className={baseClasses}>
      <h5 className={textColor}>{gl_type}</h5>
      <p className="self-center justify-self-end">
        {gl_type === "Asset" ? (
          <FaEquals />
        ) : gl_type === "Expense" ? (
          <FaMinus />
        ) : (
          <FaPlus />
        )}
      </p>
      <p className="font-medium">
        Balance :
        {formatCurrency(Math.abs(totalDebitAmount - totalCreditAmount))}
      </p>
    </div>
  );
}

export default Stat;

// align-self: end;
//   font-size: 1.2rem;
//   text-transform: uppercase;
//   letter-spacing: 0.4px;
//   font-weight: 600;
//   color: var(--color-grey-500);

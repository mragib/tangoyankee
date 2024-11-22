import { CommandGroup } from "@/components/ui/command";
import { formatCurrency } from "@/util";
import { Link } from "react-router-dom";

function SaleSuggestions({ sales, onSelect }) {
  return (
    <Link to={sales.url} onClick={onSelect}>
      <CommandGroup heading="Sale">
        <div className="grid grid-cols-2 md:grid-cols-4  hover:bg-slate-300 py-4 px-2 rounded-sm ">
          <p>{sales.invoice}</p>
          <p>{sales.delivery}</p>
          <p>{sales.customer}</p>

          <p>{formatCurrency(sales.amount)}</p>
        </div>
      </CommandGroup>
    </Link>
  );
}

export default SaleSuggestions;

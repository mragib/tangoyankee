import { CommandGroup } from "@/components/ui/command";
import { formatCurrency } from "@/util";
import { Link } from "react-router-dom";

function PurchaseSuggestions({ purchase, onSelect }) {
  return (
    <Link to={purchase.url} onClick={onSelect}>
      <CommandGroup heading="Purchase">
        <div className="grid grid-cols-2 md:grid-cols-4 hover:bg-slate-300 py-4 px-2 rounded-sm">
          <p>{purchase.invoice}</p>
          <p>{purchase.delivery}</p>

          <p>{purchase.supplierPhone}</p>
          <p>{formatCurrency(purchase.amount)}</p>
        </div>
      </CommandGroup>
    </Link>
  );
}

export default PurchaseSuggestions;

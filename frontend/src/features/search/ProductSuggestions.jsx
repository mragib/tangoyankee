import { CommandGroup } from "@/components/ui/command";
import { capitalizeFirstLetter, formatCurrency } from "@/util";

function ProductSuggestions({ product, onSelect }) {
  return (
    <CommandGroup heading="product" onClick={onSelect}>
      <div className="grid grid-cols-2 hover:bg-slate-300 py-4 px-2 rounded-sm">
        <p>{capitalizeFirstLetter(product.name)}</p>
        <p>{formatCurrency(product.price)}</p>
        <p>{product.instance}</p>
        <p>{product.quantity}</p>
      </div>
    </CommandGroup>
  );
}

export default ProductSuggestions;

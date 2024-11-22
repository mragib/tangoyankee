import { CommandGroup } from "@/components/ui/command";
import { Link } from "react-router-dom";

function SupplierSuggestions({ supplier, onSelect }) {
  return (
    <Link to={supplier.url} onClick={onSelect}>
      <CommandGroup heading="Supplier">
        <div className="grid grid-cols-2">
          <p>{supplier.name}</p>
          <p>{supplier.phone}</p>
          <p>{supplier.address}</p>
          <p>{supplier.owner}</p>
        </div>
      </CommandGroup>
    </Link>
  );
}

export default SupplierSuggestions;

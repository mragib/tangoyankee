import { CommandGroup } from "@/components/ui/command";

import { Link } from "react-router-dom";

function CustomerSuggestions({ customer, onSelect }) {
  return (
    <Link to={customer.url} onClick={onSelect} className="">
      <CommandGroup heading="Customer">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_5fr] hover:bg-slate-300 py-4 px-2 rounded-sm">
          <p>{customer.name}</p>
          <p>{customer.phone}</p>
          <p>{customer.address}</p>
        </div>
      </CommandGroup>
    </Link>
  );
}

export default CustomerSuggestions;

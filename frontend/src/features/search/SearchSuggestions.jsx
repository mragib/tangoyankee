import { Command, CommandEmpty, CommandList } from "@/components/ui/command";
import SpinnerMini from "@/ui/SpinningMini";
import CustomerSuggestions from "./CustomerSuggestions";
import SupplierSuggestions from "./SupplierSuggestions";
import PurchaseSuggestions from "./PurchaseSuggestions";
import SaleSuggestions from "./SaleSuggestions";

import ProductSuggestions from "./ProductSuggestions";

import { useEffect, useRef } from "react";

function SearchSuggestions({ suggestions, isLoading, onSelect }) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          onSelect();
        }
      }
      document.addEventListener("click", handleClick);

      return () => removeEventListener("click", handleClick);
    },
    [onSelect, ref]
  );

  if (isLoading) return <SpinnerMini />;
  // if (isLoading) return <p>Loading</p>;
  return (
    <div ref={ref}>
      <Command className="px-10 py-4">
        <CommandList>
          {suggestions.map((suggestion) => {
            if (suggestion.type === "customers")
              return (
                <CustomerSuggestions
                  key={suggestion.id}
                  customer={suggestion}
                  onSelect={onSelect}
                />
              );
            if (suggestion.type === "suppliers")
              return (
                <SupplierSuggestions
                  key={suggestion.id}
                  supplier={suggestion}
                  onSelect={onSelect}
                />
              );
            if (suggestion.type === "purchases")
              return (
                <PurchaseSuggestions
                  key={suggestion.id}
                  purchase={suggestion}
                  onSelect={onSelect}
                />
              );
            if (suggestion.type === "sales")
              return (
                <SaleSuggestions
                  key={suggestion.id}
                  sales={suggestion}
                  onSelect={onSelect}
                />
              );
            if (suggestion.type === "products")
              return (
                <ProductSuggestions
                  key={suggestion.id}
                  product={suggestion}
                  onSelect={onSelect}
                />
              );
          })}
        </CommandList>
      </Command>
    </div>
  );
}

export default SearchSuggestions;

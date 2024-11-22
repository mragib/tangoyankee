import { useState } from "react";
import Select from "../../ui/Select";

function BrandsDropdown({ brands, ...props }) {
  const [currentValue, setCurrentValue] = useState(brands[0].value);
  function handleChange(e) {
    setCurrentValue(e.target.value);
  }

  return (
    <Select
      options={brands}
      value={currentValue}
      onChange={handleChange}
      {...props}
    />
  );
}

export default BrandsDropdown;

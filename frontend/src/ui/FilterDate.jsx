import { useSearchParams } from "react-router-dom";

import { format } from "date-fns";
import Input from "./Input";

function FilterDate() {
  const [searchParams, setSearchParams] = useSearchParams();
  function handleClick(e) {
    searchParams.set(e.target.name, e.target.value);

    setSearchParams(searchParams);
  }
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex gap-3">
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <Input
          type="date"
          id="startDate"
          name="startDate"
          onChange={handleClick}
          max={today}
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <Input
          type="date"
          id="endDate"
          name="endDate"
          onChange={handleClick}
          max={today}
        />
      </div>
    </div>
  );
}

export default FilterDate;

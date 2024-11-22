import { deliveryStatusForSelect } from "@/static";
import Filter from "@/ui/Filter";
import FilterDate from "@/ui/FilterDate";
import Row from "@/ui/Row";
import { useSearchParams } from "react-router-dom";

function SalesReportOperation() {
  const [searchParam, setSearchParam] = useSearchParams();
  const removeAllFilters = () => {
    setSearchParam({}); // Clears all search parameters
  };
  return (
    <div className="flex flex-col lg:flex-row gap-2 items-center">
      <div>
        <button
          className="bg-red-700 text-white px-2 py-1 text-[10px] rounded hover:bg-red-400 "
          onClick={removeAllFilters}
        >
          Remove Filter
        </button>
      </div>

      <FilterDate />
      <Filter filterField="status" options={deliveryStatusForSelect} />
    </div>
  );
}

export default SalesReportOperation;

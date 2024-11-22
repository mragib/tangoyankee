import TableOperations from "../../ui/TableOperations";
import AddPurchase from "./AddPurchase";

// import SortBy from "../../ui/SortBy";
// import Filter from "../../ui/Filter";

function PurchaseTableOperations() {
  return (
    <TableOperations>
      {/* <Filter
        filterField="last"
        options={[
          { value: "1000000", label: "all" },
          { value: "7", label: "Last 7 days" },
          { value: "30", label: "Last 30 days" },
          { value: "90", label: "Last 90 days" },
        ]}
      /> */}
      {/* <SearchPurchase /> */}
      <AddPurchase />
      {/* <SortBy
        options={[
          { value: "startDate-desc", label: "Sort by date (recent first)" },
          { value: "startDate-asc", label: "Sort by date (earlier first)" },
          {
            value: "totalPrice-desc",
            label: "Sort by amount (high first)",
          },
          { value: "totalPrice-asc", label: "Sort by amount (low first)" },
        ]}
      /> */}
    </TableOperations>
  );
}

export default PurchaseTableOperations;

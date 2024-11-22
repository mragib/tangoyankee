import Card from "@/ui/Card";
import DataTable from "@/ui/DataTable";

function SalesProductList({ saleItems, SalesItemscolumns }) {
  return (
    <Card heading="Products">
      <DataTable data={saleItems} columns={SalesItemscolumns} />
    </Card>
  );
}

export default SalesProductList;

import ChartOfAccountingTable from "@/features/chart-of-accounting/ChartOfAccountingTable";

import Row from "@/ui/Row";
import AddChartOfAccounting from "../features/chart-of-accounting/AddChartOfAccounting";
import AddData from "@/features/chart-of-accounting/AddData";

function ChartOfAccount() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Chart of Accounts
        </h1>
        {/* <ProductTableOperation /> */}
        <AddChartOfAccounting />
        <AddData />
      </Row>
      <Row>
        {/* <ProductTable /> */}
        <ChartOfAccountingTable />
      </Row>
    </>
  );
}

export default ChartOfAccount;

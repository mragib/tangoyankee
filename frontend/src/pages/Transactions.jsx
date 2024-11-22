import TransactionTable from "@/features/transaction/TransactionTable";

import FilterDate from "@/ui/FilterDate";
import Row from "@/ui/Row";

function Transactions() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Transactions
        </h1>
        {/* <ProductTableOperation /> */}
        <FilterDate />
      </Row>
      <Row>
        <TransactionTable />
      </Row>
    </>
  );
}

export default Transactions;

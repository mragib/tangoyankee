import CustomerTable from "../features/customer/CustomerTable";
import CustomerTableOperations from "../features/customer/CustomerTableOperations";

import Row from "../ui/Row";

function Customers() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Customers
        </h1>
        <CustomerTableOperations />
      </Row>
      <Row>
        <CustomerTable />
      </Row>
    </>
  );
}

export default Customers;

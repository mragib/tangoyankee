import SupplierTable from "../features/supplier/SupplierTable";
import SupplierTableOperation from "../features/supplier/SupplierTableOperation";

import Row from "../ui/Row";

function Suppliers() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Suppliers
        </h1>
        <SupplierTableOperation />
      </Row>
      <Row>
        <SupplierTable />
      </Row>
    </>
  );
}

export default Suppliers;

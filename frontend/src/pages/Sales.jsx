import SalesTable from "@/features/sale/SalesTable";
import SalesTableOperations from "@/features/sale/SalesTableOperations";

import Row from "@/ui/Row";

function Sales() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Make a Sale
        </h1>
        <SalesTableOperations />
      </Row>

      <Row>
        <SalesTable />
      </Row>
    </>
  );
}

export default Sales;

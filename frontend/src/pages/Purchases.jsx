import PurchaseTable from "../features/purchase/PurchaseTable";
import PurchaseTableOperations from "../features/purchase/PurchaseTableOperations";

import Row from "../ui/Row";
function Purchases() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Make a Purchase
        </h1>
        <PurchaseTableOperations />
      </Row>
      <Row>
        <PurchaseTable />
      </Row>
    </>
  );
}

export default Purchases;

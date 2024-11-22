import Row from "@/ui/Row";

import AttributeSetTableOperation from "@/features/attribute set/AttributeSetTableOperation";
import AttributeSetTable from "@/features/attribute set/AttributeSetTable";

function AttributeSet() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Attribute Sets
        </h1>
        <AttributeSetTableOperation />
      </Row>
      <Row>
        <AttributeSetTable />
      </Row>
    </>
  );
}

export default AttributeSet;

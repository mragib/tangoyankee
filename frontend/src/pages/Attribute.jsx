import AttributeTable from "@/features/attribute/AttributeTable";
import AttributeTableOperation from "@/features/attribute/AttributeTableOperation";
import Row from "@/ui/Row";

function Attribute() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Attribute
        </h1>
        <AttributeTableOperation />
      </Row>
      <Row>
        <AttributeTable />
      </Row>
    </>
  );
}

export default Attribute;

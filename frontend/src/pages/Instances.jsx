import InstancesTable from "@/features/instance/InstancesTable";
import InstanceTableOperation from "@/features/instance/InstanceTableOperation";
import Row from "@/ui/Row";

function Instances() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Instances
        </h1>
        {/* <AttributeSetTableOperation /> */}
        <InstanceTableOperation />
      </Row>
      <Row>
        {/* <AttributeSetTable /> */}
        <InstancesTable />
      </Row>
    </>
  );
}

export default Instances;

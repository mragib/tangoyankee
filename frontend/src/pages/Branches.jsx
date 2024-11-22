import AddBranch from "@/features/branch/AddBranch";
import BranchTable from "@/features/branch/BranchTable";
import Row from "@/ui/Row";

function Branches() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Branches
        </h1>
        <AddBranch />
      </Row>
      <Row>
        <BranchTable />
      </Row>
    </>
  );
}

export default Branches;

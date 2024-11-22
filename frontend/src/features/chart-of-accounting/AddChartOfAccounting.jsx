import Button from "@/ui/Button";
import { Link } from "react-router-dom";

function AddChartOfAccounting() {
  return (
    <Link to="create">
      <Button>Add a Chart of accounting</Button>
    </Link>
  );
}

export default AddChartOfAccounting;

import Button from "@/ui/Button";

import { Link } from "react-router-dom";

function AddSales() {
  return (
    <Link to="create">
      <Button>Sell a Product</Button>
    </Link>
  );
}

export default AddSales;

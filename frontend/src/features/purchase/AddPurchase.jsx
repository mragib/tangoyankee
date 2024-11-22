import { Link } from "react-router-dom";
import Button from "../../ui/Button";

function AddPurchase() {
  return (
    <Link to="create">
      <Button>Add a purchase</Button>
    </Link>
  );
}

export default AddPurchase;

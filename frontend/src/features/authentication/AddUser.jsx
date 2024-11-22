import { Link } from "react-router-dom";
import Button from "../../ui/Button";

function AddUser() {
  return (
    <Link to="create">
      <Button>Add a user</Button>
    </Link>
  );
}

export default AddUser;

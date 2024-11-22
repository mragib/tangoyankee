import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import CreateCustomerForm from "./CreateCustomerForm";

function AddCustomer() {
  return (
    <Modal>
      <Modal.Open opens="supplier-form">
        <Button>Add a Customer</Button>
      </Modal.Open>
      <Modal.Window name="supplier-form">
        <CreateCustomerForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddCustomer;

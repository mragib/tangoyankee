import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateSupplierForm from "./CreateSupplierForm";

function AddSupplier() {
  return (
    <Modal>
      <Modal.Open opens="supplier-form">
        <Button>Add a Supplier</Button>
      </Modal.Open>
      <Modal.Window name="supplier-form">
        <CreateSupplierForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddSupplier;

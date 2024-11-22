import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import CreateAttributeForm from "./CreateAttributeForm";

function AddAttribute() {
  return (
    <Modal>
      <Modal.Open opens="attribute-form">
        <Button>Add a Attribute</Button>
      </Modal.Open>
      <Modal.Window name="attribute-form">
        <CreateAttributeForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddAttribute;

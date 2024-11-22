import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import CreateAttributeSetForm from "./CreateAttributeSetForm";

function AddAttributeSet() {
  return (
    <Modal>
      <Modal.Open opens="attributeset-form">
        <Button>Add a Attribute set</Button>
      </Modal.Open>
      <Modal.Window name="attributeset-form">
        <CreateAttributeSetForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddAttributeSet;

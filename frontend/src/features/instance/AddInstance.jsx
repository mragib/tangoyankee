import Button from "@/ui/Button";

import CreateInstanceForm from "./CreateInstanceForm";
import Modal from "@/ui/Modal";

function AddInstance() {
  return (
    <Modal>
      <Modal.Open opens="attributeset-form">
        <Button>Add a Instance</Button>
      </Modal.Open>
      <Modal.Window name="attributeset-form">
        <CreateInstanceForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddInstance;

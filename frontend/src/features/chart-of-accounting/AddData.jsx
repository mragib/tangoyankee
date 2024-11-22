import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import InsertInitialDataForm from "./InsertInitialDataForm";

function AddData() {
  return (
    <Modal>
      <Modal.Open opens="form">
        <Button>Add All Chart of Accounts</Button>
      </Modal.Open>
      <Modal.Window name="form">
        <InsertInitialDataForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddData;

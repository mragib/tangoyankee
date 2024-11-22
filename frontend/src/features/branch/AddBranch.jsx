import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import CreateBranchForm from "./CreateBranchForm";

function AddBranch() {
  return (
    <Modal>
      <Modal.Open opens="branch-form">
        <Button>Add a Branch</Button>
      </Modal.Open>
      <Modal.Window name="branch-form">
        <CreateBranchForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddBranch;

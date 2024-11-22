import Menus from "@/ui/Menus";
import Modal from "@/ui/Modal";
import { HiPencil } from "react-icons/hi2";
import CreateBranchForm from "./CreateBranchForm";

function BranchRow({ branch }) {
  const { id: branchId } = branch;

  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={branchId} lower={true} />
        <Menus.List id={branchId}>
          <Modal.Open opens="edit-branch">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
          {/* <Modal.Open opens="branch-active">
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open> */}
        </Menus.List>

        <Modal.Window name="edit-branch">
          {/* <CreateAttributeSetForm attributeSetToEdit={attributeSet} /> */}
          <CreateBranchForm branchToEdit={branch} />
        </Modal.Window>
        {/* </Modal>
          <Modal> */}
      </Menus.Menu>
    </Modal>
  );
}

export default BranchRow;

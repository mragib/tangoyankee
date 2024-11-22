import Modal from "@/ui/Modal";
import useDeleteInstance from "./useDeleteInstance";
import Menus from "@/ui/Menus";
import { HiPencil, HiTrash } from "react-icons/hi2";
import ConfirmDelete from "@/ui/ConfirmDelete";
import CreateInstanceForm from "./CreateInstanceForm";

function InstanceRow({ instance }) {
  const { id: instanceId } = instance;
  const { isDeleting, deleteInstance } = useDeleteInstance();
  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={instanceId} />
        <Menus.List id={instanceId}>
          <Modal.Open opens="edit-data">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
          <Modal.Open opens="delete-data">
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit-data">
          {/* <CreateAttributeSetForm attributeSetToEdit={attributeSet} /> */}
          <CreateInstanceForm insatnceToEdit={instance} />
        </Modal.Window>
        {/* </Modal>
            <Modal> */}

        <Modal.Window name="delete-data">
          <ConfirmDelete
            resource="Instance"
            disabled={isDeleting}
            onConfirm={() => {
              deleteInstance(instanceId);
            }}
          />
        </Modal.Window>
      </Menus.Menu>
    </Modal>
  );
}

export default InstanceRow;

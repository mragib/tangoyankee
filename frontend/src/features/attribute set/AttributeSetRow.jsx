import useDeleteAttributeSet from "./useDeleteAttributeSet";
import Modal from "@/ui/Modal";

import Menus from "@/ui/Menus";
import { HiPencil, HiTrash } from "react-icons/hi2";
import CreateAttributeSetForm from "./CreateAttributeSetForm";
import ConfirmDelete from "@/ui/ConfirmDelete";

function AttributeSetRow({ attributeSet }) {
  const { id: attributeSetId } = attributeSet;
  const { isDeleting, deleteAttributeSet } = useDeleteAttributeSet();
  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={attributeSetId} />
        <Menus.List id={attributeSetId}>
          <Modal.Open opens="edit-attribute-set">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
          <Modal.Open opens="delete-data">
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit-attribute-set">
          <CreateAttributeSetForm attributeSetToEdit={attributeSet} />
        </Modal.Window>
        {/* </Modal>
          <Modal> */}

        <Modal.Window name="delete-data">
          <ConfirmDelete
            resource="Attribute Set"
            disabled={isDeleting}
            onConfirm={() => {
              deleteAttributeSet(attributeSetId);
            }}
          />
        </Modal.Window>
      </Menus.Menu>
    </Modal>
  );
}

export default AttributeSetRow;

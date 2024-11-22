import Modal from "@/ui/Modal";

import Menus from "@/ui/Menus";
import { HiPencil } from "react-icons/hi2";

import CreateAttributeForm from "./CreateAttributeForm";

function AttributeRow({ attribute }) {
  const { id: attributeId } = attribute;

  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={attributeId} lower={true} />
        <Menus.List id={attributeId}>
          <Modal.Open opens="edit-attribute">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit-attribute">
          <CreateAttributeForm attributeToEdit={attribute} />
        </Modal.Window>
      </Menus.Menu>
    </Modal>
  );
}

export default AttributeRow;

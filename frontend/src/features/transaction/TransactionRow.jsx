import Menus from "@/ui/Menus";
import Modal from "@/ui/Modal";
import { HiPencil } from "react-icons/hi2";

function TransactionRow({ transaction }) {
  const { id: transactionId } = transaction;

  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={transactionId} lower={true} />
        <Menus.List id={transactionId}>
          <Modal.Open opens="edit-attribute">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit-attribute">
          {/* <CreateAttributeForm attributeToEdit={attribute} /> */}
        </Modal.Window>
      </Menus.Menu>
    </Modal>
  );
}

export default TransactionRow;

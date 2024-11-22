import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { HiPencil, HiTrash } from "react-icons/hi2";

import useDeletePaymentMethod from "./useDeletePaymentMethod";
import CreatePaymentMethodForm from "./CreatePaymentMethodForm";

function PaymentMethodRow({ paymentMethod }) {
  const { id: paymentMethodId } = paymentMethod;
  const { isDeleting, deletePaymentMethod } = useDeletePaymentMethod();
  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={paymentMethodId} lower={true} />
        <Menus.List id={paymentMethodId}>
          <Modal.Open opens="edit-data">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
          {/* <Modal.Open opens="delete-data">
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open> */}
        </Menus.List>

        <Modal.Window name="edit-data">
          <CreatePaymentMethodForm paymentMethodToEdit={paymentMethod} />
        </Modal.Window>
        {/* </Modal>
          <Modal> */}

        {/* <Modal.Window name="delete-data">
          <ConfirmDelete
            resource="Attribute"
            disabled={isDeleting}
            onConfirm={() => {
              deleteAttribute(attributeId);
            }}
          />
        </Modal.Window> */}
      </Menus.Menu>
    </Modal>
  );
}

export default PaymentMethodRow;

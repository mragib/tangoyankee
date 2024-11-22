import ConfirmChangeStatus from "@/ui/ConfirmChangeStatus";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Menus from "@/ui/Menus";
import Modal from "@/ui/Modal";
import { HiBolt, HiBoltSlash, HiPencil, HiTrash } from "react-icons/hi2";
import useDeleteCustomer from "../customer/useDeleteCustomer";
import useChangeCustomarStatus from "../customer/useChangeCustomarStatus";
import CreateSaleForm from "./CreateSaleForm";

function SaleRow({ sale }) {
  const { id: saleId, is_active } = sale;
  const { isDeleting, deleteCustomers } = useDeleteCustomer();
  const { isChanging, changeStatus } = useChangeCustomarStatus();

  function handleStatus(data) {
    const { is_active, saleId } = data;
    changeStatus({ newStatus: { is_active }, id: saleId });
  }
  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={saleId} />
        <Menus.List id={saleId}>
          <Modal.Open opens="edit-customer">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
          <Modal.Open opens="status-customer">
            <Menus.Button icon={is_active ? <HiBoltSlash /> : <HiBolt />}>
              {!is_active ? "Active" : "Inactive"}
            </Menus.Button>
          </Modal.Open>
          <Modal.Open opens="delete-customer">
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit-customer">
          <CreateSaleForm customerToEdit={customer} />
        </Modal.Window>
        {/* </Modal>
              <Modal> */}
        <Modal.Window name="status-customer">
          {/* <ConfirmChangeStatus
              action={!is_active ? "Active" : "Inactive"}
              resource="Sale"
              disabled={isChanging}
              onConfirm={() => {
                handleStatus({ is_active: !is_active, saleId });
              }}
            /> */}
        </Modal.Window>

        <Modal.Window name="delete-customer">
          {/* <ConfirmDelete
              resource="Sale"
              disabled={isDeleting}
              onConfirm={() => deleteCustomers(saleId)}
            /> */}
        </Modal.Window>
      </Menus.Menu>
    </Modal>
  );
}

export default SaleRow;

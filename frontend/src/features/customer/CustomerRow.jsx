import Modal from "../../ui/Modal";
import { HiBolt, HiBoltSlash, HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import CreateCustomerForm from "./CreateCustomerForm";
import useDeleteCustomer from "./useDeleteCustomer";
import ConfirmChangeStatus from "@/ui/ConfirmChangeStatus";
import useChangeCustomarStatus from "./useChangeCustomarStatus";
import { useNavigate } from "react-router-dom";

function CustomerRow({ customer }) {
  const { id: customerId, is_active } = customer;
  const { isDeleting, deleteCustomers } = useDeleteCustomer();
  const { isChanging, changeStatus } = useChangeCustomarStatus();
  const navigate = useNavigate();

  function handleStatus(data) {
    const { is_active, customerId } = data;
    changeStatus({ newStatus: { is_active }, id: customerId });
  }

  return (
    <div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={customerId} />
          <Menus.List id={customerId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/people/customer/${customerId}`)}
            >
              See details
            </Menus.Button>
            <Modal.Open opens="edit-customer">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="status-customer">
              <Menus.Button icon={is_active ? <HiBoltSlash /> : <HiBolt />}>
                {!is_active ? "Active" : "Inactive"}
              </Menus.Button>
            </Modal.Open>
            {/* <Modal.Open opens="delete-customer">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open> */}
          </Menus.List>

          <Modal.Window name="edit-customer">
            <CreateCustomerForm customerToEdit={customer} />
          </Modal.Window>
          {/* </Modal>
          <Modal> */}
          <Modal.Window name="status-customer">
            <ConfirmChangeStatus
              action={!is_active ? "Active" : "Inactive"}
              resource="Customer"
              disabled={isChanging}
              onConfirm={() => {
                handleStatus({ is_active: !is_active, customerId });
              }}
            />
          </Modal.Window>

          {/* <Modal.Window name="delete-customer">
            <ConfirmDelete
              resource="Customer"
              disabled={isDeleting}
              onConfirm={() => deleteCustomers(customerId)}
            />
          </Modal.Window> */}
        </Menus.Menu>
      </Modal>
    </div>
  );
}

export default CustomerRow;

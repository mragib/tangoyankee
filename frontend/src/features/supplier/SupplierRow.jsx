import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import CreateSupplierForm from "./CreateSupplierForm";

import ConfirmChangeStatus from "../../ui/ConfirmChangeStatus";
import useChangeStatusSupplier from "./useChangeStatusSupplier";
import { useNavigate } from "react-router-dom";

function SupplierRow({ supplier }) {
  const { id: supplierId, status } = supplier;
  const { isChanging, changeStatus } = useChangeStatusSupplier();
  const navigate = useNavigate();

  function handleStatus(data) {
    const { status, supplierId } = data;
    changeStatus(
      { newStatus: { status }, id: supplierId }
      // {
      //   onSettled: () => {
      //     onCloseModal?.();
      //   },
      // }
    );
  }

  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={supplierId} />
        <Menus.List id={supplierId}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/people/supplier/${supplierId}`)}
          >
            See details
          </Menus.Button>
          <Modal.Open opens="edit-supplier">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
          <Modal.Open opens="delete-supplier">
            <Menus.Button icon={<HiTrash />}>
              {!status ? "Active" : "Inactive"}
            </Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit-supplier">
          <CreateSupplierForm supplierToEdit={supplier} />
        </Modal.Window>
        {/* </Modal>
          <Modal> */}

        <Modal.Window name="delete-supplier">
          <ConfirmChangeStatus
            action={!status ? "Active" : "Inactive"}
            resource="Supplier"
            disabled={isChanging}
            onConfirm={() => {
              handleStatus({ status: !status, supplierId });
            }}
          />
        </Modal.Window>
      </Menus.Menu>
    </Modal>
  );
}

export default SupplierRow;

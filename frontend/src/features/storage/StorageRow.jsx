import { HiPencil } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";
import CreateStorageForm from "./CreateStorageForm";

function StorageRow({ storage }) {
  const { id: storageId } = storage;

  return (
    <div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={storageId} lower={true} />
          <Menus.List id={storageId}>
            <Modal.Open opens="edit-storage">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>
            {/* <Modal.Open opens="delete-product">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open> */}
          </Menus.List>

          <Modal.Window name="edit-storage">
            <CreateStorageForm storageToEdit={storage} />
          </Modal.Window>
          {/* </Modal>
          <Modal> */}

          {/* <Modal.Window name="delete-product">
            <ConfirmDelete
              resource="Product"
              disabled={isDeleting}
              onConfirm={() => deleteProduct(productId)}
            />
          </Modal.Window> */}
        </Menus.Menu>
      </Modal>
    </div>
  );
}

export default StorageRow;

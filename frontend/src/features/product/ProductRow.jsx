import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";

import CreateProductForm from "./CreateProductForm";
import useDeleteProduct from "./useDeleteProduct";
import ConfirmDelete from "../../ui/ConfirmDelete";

function ProductRow({ product }) {
  const { id: productId } = product;
  const { isDeleting, deleteProduct } = useDeleteProduct();
  return (
    <div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={productId} />
          <Menus.List id={productId}>
            <Modal.Open opens="edit-product">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>
            <Modal.Open opens="delete-product">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="edit-product">
            <CreateProductForm productToEdit={product} />
          </Modal.Window>
          {/* </Modal>
          <Modal> */}

          <Modal.Window name="delete-product">
            <ConfirmDelete
              resource="Product"
              disabled={isDeleting}
              onConfirm={() => deleteProduct(productId)}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </div>
  );
}

export default ProductRow;

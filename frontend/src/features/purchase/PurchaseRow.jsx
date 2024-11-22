import { HiArrowUpOnSquare, HiEye } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import Menus from "../../ui/Menus";

import ConfirmDelete from "../../ui/ConfirmDelete";
import { useNavigate } from "react-router-dom";
import useDeletePurchase from "./useDeletePurchase";

function PurchaseRow({ purchase }) {
  const { id: purchaseId } = purchase;

  const navigate = useNavigate();

  const { isDeleting, deletePurchase } = useDeletePurchase();

  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={purchaseId} />
        <Menus.List id={purchaseId}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/purchases/${purchaseId}`)}
          >
            See details
          </Menus.Button>
          {/* {status === "unconfirmed" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/checkin/${bookingId}`)}
              >
                Check in
              </Menus.Button>
            )}

            {status === "checked-in" && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={() => {
                  checkout(bookingId);
                }}
              >
                Check out
              </Menus.Button>
            )} */}
          <Modal.Open opens="delete">
            <Menus.Button icon={<HiArrowUpOnSquare />}>Delete</Menus.Button>
          </Modal.Open>
        </Menus.List>
      </Menus.Menu>
      <Modal.Window name="delete">
        <ConfirmDelete
          resource="purchase"
          disabled={isDeleting}
          onConfirm={() => deletePurchase(purchaseId)}
        />
      </Modal.Window>
    </Modal>
  );
}

export default PurchaseRow;

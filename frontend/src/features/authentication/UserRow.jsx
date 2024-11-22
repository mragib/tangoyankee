import Modal from "../../ui/Modal";

import Menus from "../../ui/Menus";
import { HiTrash } from "react-icons/hi2";
import ConfirmDelete from "../../ui/ConfirmDelete";
import useDeleteUser from "./useDeleteUser";

function UserRow({ user }) {
  const { id: userId } = user;
  const { isDeleting, deleteUser } = useDeleteUser();
  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={userId} lower="true" />
        <Menus.List id={userId}>
          <Modal.Open opens="delete-user">
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open>
        </Menus.List>

        <Modal.Window name="edit-user">
          {/* <CreateBrandForm brandToEdit={user} /> */}
        </Modal.Window>
        {/* </Modal>
            <Modal> */}

        <Modal.Window name="delete-user">
          <ConfirmDelete
            resource="User"
            disabled={isDeleting}
            onConfirm={() => deleteUser(userId)}
          />
        </Modal.Window>
      </Menus.Menu>
    </Modal>
  );
}

export default UserRow;

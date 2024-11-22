import Menus from "@/ui/Menus";
import Modal from "@/ui/Modal";
import { HiPencil } from "react-icons/hi2";
import CreateChartofAccountingForm from "./CreateChartofAccountingForm";

function ChartOfAccountingRow({ chartOfAccount }) {
  const { id: chartOfAccountId } = chartOfAccount;
  return (
    <Modal>
      <Menus.Menu>
        <Menus.Toggle id={chartOfAccountId} lower={true} />
        <Menus.List id={chartOfAccountId}>
          <Modal.Open opens="edit-attribute">
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
          </Modal.Open>
          {/* <Modal.Open opens="delete-data">
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Modal.Open> */}
        </Menus.List>

        <Modal.Window name="edit-attribute">
          {/* <CreateAttributeForm attributeToEdit={attribute} /> */}
          <CreateChartofAccountingForm
            chartOfAccountingToEdit={chartOfAccount}
          />
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

export default ChartOfAccountingRow;

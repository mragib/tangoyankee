import Button from "@/ui/Button";
import Modal from "@/ui/Modal";
import CreateExpenseForm from "./CreateExpenseForm";

function AddExpense() {
  return (
    <Modal>
      <Modal.Open opens="expense-form">
        <Button variations="danger">Add a Expense</Button>
      </Modal.Open>
      <Modal.Window name="expense-form">
        <CreateExpenseForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddExpense;

import { TransactionType } from "@/static";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreatePaymentMethodForm from "./CreatePaymentMethodForm";
import CreateTransferMoneyForm from "./CreateTransferMoneyForm";

function AddPaymentMethod() {
  return (
    <Modal>
      <Modal.Open opens="payment-method-form">
        <Button>Add a payment method</Button>
      </Modal.Open>
      <Modal.Open opens="transfer-form">
        <Button>Transfer Money</Button>
      </Modal.Open>
      <Modal.Open opens="Withdraw-form">
        <Button>Withdraw Money</Button>
      </Modal.Open>
      <Modal.Open opens="Deposit-form">
        <Button>Deposit Money</Button>
      </Modal.Open>
      <Modal.Window name="payment-method-form">
        <CreatePaymentMethodForm />
      </Modal.Window>
      <Modal.Window name="transfer-form">
        <CreateTransferMoneyForm activity={TransactionType.TRANSFER} />
      </Modal.Window>
      <Modal.Window name="Withdraw-form">
        <CreateTransferMoneyForm activity={TransactionType.WITHDRAW} />
      </Modal.Window>
      <Modal.Window name="Deposit-form">
        <CreateTransferMoneyForm activity={TransactionType.DEPOSIT} />
      </Modal.Window>
    </Modal>
  );
}

export default AddPaymentMethod;

import AddPaymentMethod from "@/features/payment-method/AddPaymentMethod";
import PaymentMethodTable from "@/features/payment-method/PaymentMethodTable";

import Row from "@/ui/Row";

function BankAccount() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Bank Accounts
        </h1>
      </Row>
      <div className="flex gap-6 py-2 flex-col md:flex-row">
        <AddPaymentMethod />
      </div>

      <Row>
        <PaymentMethodTable />
      </Row>
    </>
  );
}

export default BankAccount;

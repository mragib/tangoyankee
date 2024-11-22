import CustomerPaymentDateTable from "./CustomerPaymentDateTable";
import SupplierPaymentDateTable from "./SupplierPaymentDateTable";

function PaymentPlanLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <CustomerPaymentDateTable />
      <SupplierPaymentDateTable />
    </div>
  );
}

export default PaymentPlanLayout;

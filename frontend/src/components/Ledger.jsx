import Tag from "@/ui/Tag";
import { formatCurrency } from "@/util";

function Ledger({ payment, data }) {
  const totalAmount = data.reduce((acc, curr) => curr.totalAmount + acc, 0);
  const totalPaid = payment.reduce((acc, curr) => curr.amountPaid + acc, 0);
  return (
    <div className="grid grid-cols-1">
      <Tag type="green">Total Amount: {formatCurrency(totalAmount)}</Tag>
      <Tag type="blue">Total Paid: {formatCurrency(totalPaid)}</Tag>
      <Tag type="red">
        Total Payable: {formatCurrency(Math.ceil(totalAmount - totalPaid))}
      </Tag>
    </div>
  );
}

export default Ledger;
